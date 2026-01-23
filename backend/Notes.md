

## How to generate backend.ts file

### Using Intellij Idea
1. Open maven in intellij idea
2. Click Project name (in this case: backend)
3. Click Lifecycle
4. Double click clean
5. Double click package
6. Done

### Using command
> mvn clean package

Note that @Client annotation need to be added to the class to appear in backend.ts