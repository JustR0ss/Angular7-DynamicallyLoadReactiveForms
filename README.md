# DynamicallyLoadReactiveForms

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.5.

This project shows how to dynamically add in components to display and make the their form part of the over all reactive form.

In this example, I default to one component showing with certain validations and the when clicking the toggle button I remove all the previous validators and load the new component and propogate the new component value and validators.

This can be handy if you have lots of components to switch between. You can just add the component to the entry modules and in the componentlist in the directive. Inputs and outputs can be specified by using interfaces. 

This saves having 100s of 'NgIf' in the main template and every view checking all the ngifs


## Make sure

The components that are being loaded make sure the form is set in the constructor:

constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            selectedColor: ['', [Validators.minLength(4), Validators.required]]
        });
}

The components that are getting loaded have to be put in the entryComponents array in the app.module.ts as part of the mgmodule otherwise as part of the treeshaker in the angular build the project wont include that component as there is no link.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
