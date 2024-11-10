# Entity - Project

The project is the main entity of the system that the user is working on. Projects can be saved in the browser, modified and exported.

## UI

- `ProjectCard` - specific project card

## Model

### Repository

- interface `ProjectRepository`
- class `IndexedDBProjectRepository` - repository for the indexed db storage

### Store

- `activeProject` - currently loaded project

## Lib

- `formatDate` - date formatting helper
