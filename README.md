# Dynamically Load Reactive Forms

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

The components that are getting loaded have to be put in the entryComponents array in the app.module.ts as part of the ngmodule otherwise as part of the treeshaker in the angular build the project wont include that component as there is no link.

## Explanation

When the dynamic component is initially loaded in you need, the write value gets called to pass in the values. If the form has other default values or validators you need to propogate the the form state back up so the parent knows about it immediately. Doing this set validators inside the directive and inside the parent form.

When the dynamic component changes, the validators for those fields need to be removed. This requires removing the validators inside the directive and the parent form control that matches the name set in the directive.


**Inside the parent:**
this.form.get('color').setValidators(undefined);
this.form.get('color').updateValueAndValidity({ emitEvent: false });

**Inside the directive**
this.container.clear(); // Remove the component view
this.validators = []; // Remove the validators
this._control = this.formDirective.removeControl(this); // Remove the previous control instance of the directive.
this.valueAccessor = undefined; // Remove previous form value.


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
