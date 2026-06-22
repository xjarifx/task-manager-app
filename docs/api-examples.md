# Task Manager API Examples

## GET all tasks

```bash
curl http://localhost:3000/api/tasks
```

## POST a new task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread", "status": "TODO"}'
```

## PUT update a task

```bash
curl -X PUT http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "title": "Buy groceries", "description": "Milk, eggs, bread, butter", "status": "IN_PROGRESS"}'
```

## DELETE a task

```bash
curl -X DELETE http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"id": 1}'
```
