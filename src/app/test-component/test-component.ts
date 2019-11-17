import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators, NG_VALIDATORS, FormControl, ControlValueAccessor, Validator } from '@angular/forms'
import { DynamicComponentInterface } from '../interfaces/dyanamically-loaded-interfaces';

@Component({
    selector: 'app-test',
    templateUrl: './test-component.html',
    styleUrls: ['./test-component.css'],
    providers: [
		{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: TestComponent },
		{ provide: NG_VALIDATORS, multi: true, useExisting: TestComponent }
	]
})
export class TestComponent implements OnInit, ControlValueAccessor, Validator, DynamicComponentInterface {

    @Input() extraField: any;

    propagateChange = (_: any) => { };
    propagateTouched = (_: any) => { };
    registerOnChange(fn) { this.propagateChange = fn; }
    registerOnTouched(fn) { }

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            selectedColor: ['', [Validators.minLength(4), Validators.required]]
        });
    }

    ngOnInit(): void {
        this.form.valueChanges.subscribe(() => {            
            this.propagateChange(this.form.value.selectedColor);
        });
    }
    
    validate(c: FormControl)  {
		if (this.form && this.form.valid === false) {
			return {name: 'not entered 1' };
		}

		return null;
	}

    writeValue(value) {
        if (value) {
            // Prevent broadcast and propage change.
            this.form.get('selectedColor').patchValue(value, { emitEvent: false });
            this.propagateChange(this.form.value.selectedColor);
        }
    }

    
}
