# Entity - Project

The project is the main entity of the system that the user is working on. Projects can be saved in the browser, modified and exported.

## UI

- `ProjectCard` - specific project card
- `ProjectList` - modal to view all the projects
- `ProjectSort` - dropdown to change the sort order in the project list

## Model

### Repository

- interface `ProjectRepository`
- class `IndexedDBProjectRepository` - repository for the indexed db storage

### Store

- `activeProject` - currently loaded project
- `sortBy` - sorting order for the project list

## Lib

- `formatDate` - date formatting helper
