import { Directive, ViewContainerRef, OnInit, Input, ComponentFactoryResolver, ComponentRef, Output, EventEmitter, Optional, Host, SkipSelf, Inject, Self, forwardRef, SimpleChanges } from '@angular/core';
import { NgControl, AbstractControl, FormControl, ControlContainer, ValidatorFn, AsyncValidatorFn, NG_VALIDATORS, Validator, Validators } from '@angular/forms';
import { TestComponent } from '../test-component/test-component';
import { DynamicComponentInterface } from '../interfaces/dyanamically-loaded-interfaces';
import { TestComponent2 } from '../test-component2/test-component2';

export const controlNameBinding: any = {
    provide: NgControl,
    useExisting: forwardRef(() => TestDirective)
};

@Directive({
    selector: '[test-host]',
})
export class TestDirective extends NgControl implements OnInit {
  name: string;

    component: ComponentRef<any>;
    // Add more components to list, make sure they have interface.
    componentList =  [TestComponent, TestComponent2];
    @Input() fieldData:string;
    @Input() componentViewNo: Number;
    @Input() formValue:any;;

    @Output('ngModelChange') update = new EventEmitter();

    _control: FormControl;

    constructor(
        @Optional() @Host() @SkipSelf() private parent: ControlContainer,
        @Optional() @Self() @Inject(NG_VALIDATORS) private validators: Array<Validator|ValidatorFn>,
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef) {
        super();
    }

    ngOnInit() {
        this.displayComponentView(1);
    }

    displayComponentView(componentViewNo): void {
        const selectedComponent = this.componentList[componentViewNo - 1];
        const component = this.resolver.resolveComponentFactory<TestComponent>(selectedComponent as any);
        // Should be name of object property in parent
        this.name = 'color';
        this.component = this.container.createComponent(component);
        // Use interface to detect public properties of class.
        const compInt = this.component.instance as DynamicComponentInterface;
        compInt.extraField = this.fieldData;
        this.valueAccessor = this.component.instance;
        const ngValidators = this.component.injector.get(NG_VALIDATORS, null);
        if(ngValidators && ngValidators.some(x => x === this.component.instance)) {
            this.validators = [...(this.validators || []), ...(ngValidators as Array<Validator|ValidatorFn>)];
        }
        this._control = this.formDirective.addControl(this);
    }

    // Detect changes to input variable
    ngOnChanges(changes: SimpleChanges): void {
        if (this.component) {
            if (changes.componentViewNo) {
                // Clear the view container.
                this.container.clear();
                // Remove previous validators.
                this.validators = [];
                // Remove the previous instance of the directive.
                this._control = this.formDirective.removeControl(this);
                // Remove previous form value.
                this.valueAccessor = undefined;
                this.displayComponentView(changes.componentViewNo.currentValue);
            }
            if (changes.fieldData) {
                const compInt = this.component.instance as DynamicComponentInterface;
                compInt.extraField = this.fieldData;
            }
        }
    }

    get path(): string[] {
        return [...this.parent.path !, this.name];
    }

    get formDirective(): any { return this.parent ? this.parent.formDirective : null; }

    get control(): FormControl { return this._control; }

    get validator(): ValidatorFn|null {
        return this.validators != null ? Validators.compose(this.validators.map(normalizeValidator)) : null;
    }

    get asyncValidator(): AsyncValidatorFn { return null; }

    viewToModelUpdate(newValue: any): void {
        this.update.emit(newValue);
    }

    ngOnDestroy(): void {
        if (this.formDirective) {
            this.formDirective.removeControl(this);
        }
        if(this.component) {
            this.component.destroy();
        }
    }
}

export function normalizeValidator(validator: ValidatorFn | Validator): ValidatorFn {
    if ((<Validator>validator).validate) {
        return (c: AbstractControl) => (<Validator>validator).validate(c);
    } else {
        return <ValidatorFn>validator;
    }
}

