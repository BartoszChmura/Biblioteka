# Biblioteka Online

## Temat i opis projektu
Biblioteka online to apliacja webowa imitująca działanie tradycyjnej biblioteki. Projekt składa się z części backendowej (Python, Flask), frontendowej (JS, React) oraz bazy danych PostgreSQL. Aplikacja posiada 5 kluczowych funkcjonalności i składa się z 4 kontenerów Docker. Dokładny spis funkcjonalności i kontenerów znajduje się poniżej.

## Twórca projektu (indywidualnie)
- Bartosz Chmura 42878

## Funkcjonalności
1. Logowanie, rejestracja i uwierzytelnianie użytkowników (JWT)
2. CRUD na książkach w bibliotece z panelu administratora
3. Wyświetlanie listy książek z funkcjami paginacji, sortowania i wyszukiwania po tytule
4. System wypożyczania oraz zwracania książek przez użytkownika
5. Historia wypożyczeń i zwrotów użytkownika

## Kontenery
1. biblioteka_backend
2. biblioteka_frontend
3. biblioteka_db
4. biblioteka_pgadmin

## Kroki do uruchomienia
Cała aplikacja oraz 80% funkcjonalności działa po uruchomieniu docker-compose up.

### Poboczne kroki do uzyskania pełnej funkcjonalności
1. Aby uzyskać dostęp do panelu administratora (CRUD książek), należy utworzyć użytkownika o nazwie "admin".
2. Aby zapełnić bibliotekę przykładowymi książkami w celu łatwiejszego testowania funkcjonalności należy wpisać odpowiednią komendę która uruchomi skrypt/metodę:

```bash
Z poziomu CLI kontenera biblioteka_backend:
flask seed_books
```

```bash
Z poziomu terminala:
docker exec -it flask_app flask seed_books
```
