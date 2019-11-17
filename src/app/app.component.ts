import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  form: FormGroup;
  state = 'invalid';
  title = 'my-app';
  otherData: string;
  componentViewNo = 1;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      color: 'red'
    });
  }

  ngOnInit(): void {

    this.form.valueChanges.subscribe(val => {
      this.state = this.form.valid ? 'valid' : 'invalid';
    });

  }

  toggleComponent(): void {
    // Make sure to clear previous propagated validors when changing component.
    this.form.get('color').setValidators(undefined);
    this.form.get('color').updateValueAndValidity({ emitEvent: false });
    this.componentViewNo = this.componentViewNo === 1 ? 2 : 1;
  }

  
  
}
