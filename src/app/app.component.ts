import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { PasswordValidator } from './shared/password.validator';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  registrationForm: any;

  constructor(
    private fb: FormBuilder,
    private _registrationService: RegistrationService
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/admin/)]],
      email: [''],
      subscribed: [false],
      password: [''],
      confirmPassword: [''],
      address: this.fb.group({
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      alternateEmails: this.fb.array([])  //dynamic Validation
    }, { validator: PasswordValidator });

    // conditional Validation
    this.registrationForm.get('subscribed').valueChanges.subscribe((checkedValue: any) => {
      const email = this.registrationForm.get('email');
      if (checkedValue) {
        email.setValidators(Validators.required)
      } else {
        email.clearValidators();
      }
      email.updateValueAndValidity();
    })
  }

  get userName() {
    return this.registrationForm.get('userName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  // Dynamic Validation
  get alternateEmails() {
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  // Dynamic Validation
  addAlternateEmail() {
    this.alternateEmails.push(this.fb.control(''))
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value).subscribe(
      (response: any) => console.log('success', response),
      (error: any) => console.log('error', error)
    );
  }

  // registrationForm = new FormGroup({
  //   userName : new FormControl(''),
  //   password : new FormControl(''),
  //   confirmPassword : new FormControl(''),
  //   address : new FormGroup({
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     postalCode : new FormControl('')
  //   })
  // });

  loadApiData() {
    // this.registrationForm.setValue({
    //   userName : 'Burce',
    //   password : 'test',
    //   confirmPassword : 'test',
    //   address : {
    //     city : 'city',
    //     state : 'state',
    //     postalCode : '123456'
    //   }
    // })

    this.registrationForm.patchValue({
      userName: 'Burce',
      password: 'test',
      confirmPassword: 'test',
    })
  }
}
