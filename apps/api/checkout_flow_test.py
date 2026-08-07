import json
import ssl
import urllib.error
import urllib.request

BASE = "http://localhost:5000"
ctx = ssl._create_unverified_context()


def req(method, path, token=None, data=None):
    url = BASE + path
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, context=ctx, timeout=20) as response:
            text = response.read().decode("utf-8")
            return json.loads(text)
    except urllib.error.HTTPError as e:
        try:
            return {"http_error": e.code, "body": json.loads(e.read().decode("utf-8"))}
        except Exception:
            return {"http_error": e.code, "body": e.read().decode("utf-8")}
    except Exception as e:
        return {"exception": str(e)}


def main():
    print("Health check:")
    print(req("GET", "/api/health"))

    print("\nRegistering test user:")
    register = req("POST", "/api/auth/register", data={
        "email": "testuser@example.com",
        "password": "TestUser123",
        "firstName": "Test",
        "lastName": "User"
    })
    print(register)

    if "error" in register or "http_error" in register:
        print("User may already exist, trying login")
    print("\nLogging in test user:")
    user_login = req("POST", "/api/auth/login", data={
        "email": "testuser@example.com",
        "password": "TestUser123"
    })
    print(user_login)
    user_token = user_login.get("data", {}).get("accessToken") if isinstance(user_login, dict) else None
    if not user_token:
        raise SystemExit("User login failed")

    print("\nFetching products:")
    products = req("GET", "/api/products")
    print(products)
    if not products or "error" in products or "http_error" in products:
        raise SystemExit("Failed to fetch products")

    items = products.get("products") if isinstance(products, dict) else None
    if items and len(items) > 0:
        product = items[0]
    else:
        product = None
    if not product:
        raise SystemExit("No products found")

    product_slug = product.get("slug")
    variant = None
    for v in product.get("variants", []):
        if v.get("stock", 0) > 0:
            variant = v
            break
    if not variant:
        raise SystemExit("No in-stock variant found")

    print("\nAdding product to cart:")
    add_cart = req("POST", "/api/cart/items", token=user_token, data={
        "variantId": variant["id"],
        "quantity": 1
    })
    print(add_cart)

    print("\nCreating address:")
    address = req("POST", "/api/addresses", token=user_token, data={
        "title": "Home",
        "fullName": "Test User",
        "phone": "05551234567",
        "city": "Istanbul",
        "district": "Kadikoy",
        "fullAddress": "Test street 123",
        "zipCode": "34710",
        "isDefault": True
    })
    print(address)
    address_id = address.get("data", {}).get("id") if isinstance(address, dict) else None
    if not address_id:
        raise SystemExit("Address creation failed")

    print("\nCreating order:")
    order = req("POST", "/api/orders", token=user_token, data={
        "addressId": address_id,
        "payment": {
            "cardNumber": "1234567812345678",
            "cardHolder": "Test User",
            "expiry": "12/28",
            "cvv": "123"
        }
    })
    print(order)
    order_id = order.get("data", {}).get("id") if isinstance(order, dict) else None
    if not order_id:
        raise SystemExit("Order creation failed")

    print("\nListing user orders:")
    my_orders = req("GET", "/api/orders", token=user_token)
    print(my_orders)

    print("\nLogging in admin:")
    admin_login = req("POST", "/api/auth/login", data={
        "email": "admin@shop.com",
        "password": "Admin123!"
    })
    print(admin_login)
    admin_token = admin_login.get("data", {}).get("accessToken") if isinstance(admin_login, dict) else None
    if not admin_token:
        raise SystemExit("Admin login failed")

    print("\nUpdating order status to SHIPPED:")
    status_update = req("PATCH", f"/api/orders/admin/{order_id}/status", token=admin_token, data={
        "status": "SHIPPED"
    })
    print(status_update)

    print("\nFetching product detail after purchase:")
    detail = req("GET", f"/api/products/slug/{product_slug}")
    print(detail)

    if isinstance(detail, dict) and detail.get("data"):
        variant_after = next((v for v in detail["data"].get("variants", []) if v["id"] == variant["id"]), None)
        print("\nVariant stock after purchase:", variant_after.get("stock") if variant_after else "not found")
    else:
        print("Product detail fetch failed")


if __name__ == "__main__":
    main()
