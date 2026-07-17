# Commit Rehberi

## Conventional Commits formatı
```
<tip>(<kapsam>): <kısa açıklama>
```

### Tipler
- `feat`     : yeni özellik
- `fix`      : hata düzeltme
- `chore`    : yapılandırma, bağımlılık, tooling
- `docs`     : dokümantasyon
- `style`    : biçimlendirme (kod mantığı değişmez)
- `refactor` : kod düzenleme
- `test`     : test ekleme/düzeltme

### Örnekler
```
feat(auth): add JWT login endpoint
fix(cart): prevent adding out-of-stock variant
chore(docker): add postgres healthcheck
docs(readme): update setup instructions
```

## Kurallar
- Her gün en az bir **anlamlı** commit at.
- Tek dev commit yerine mantıklı parçalara böl.
- Boş / anlamsız commit atma (hoca inceleyecek).
- Commit'leri **VS Code Source Control** panelinden at (GitHub Desktop yasak).
