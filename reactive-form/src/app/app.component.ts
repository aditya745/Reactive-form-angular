import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { forbiddenNameValidator } from "./shared/user-name.validator";
import { PasswordValidator } from "./shared/password.validator";
import { RegistrationService } from "./registration.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  registrationForm: FormGroup;
  get userName() {
    return this.registrationForm.get("userName");
  }

  get email() {
    return this.registrationForm.get("email");
  }

  constructor(
    private fb: FormBuilder,
    private _registrationService: RegistrationService
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group(
      {
        userName: [
          "",
          [Validators.required, Validators.minLength(3), forbiddenNameValidator]
        ],
        email: [""],
        subscribe: [false],
        password: [""],
        confirmPassword: [""],
        address: this.fb.group({
          city: [""],
          state: [""],
          postalCode: [""]
        })
      },
      { validator: PasswordValidator }
    );
    this.registrationForm
      .get("subscribe")
      .valueChanges.subscribe(checkedValue => {
        const email = this.registrationForm.get("email");
        if (checkedValue) {
          email.setValidators(Validators.required);
        } else {
          email.clearValidators;
        }
        email.updateValueAndValidity();
      });
  }

  //registrationForm = new FormGroup({
  //userName: new FormControl('Aditya'),
  //password: new FormControl(''),
  //confirmPassword: new FormControl(''),
  //address: new FormGroup({
  //city: new FormControl(''),
  //state: new FormControl(''),
  //postalCode: new FormControl(''),
  //})
  //});

  loadApi() {
    this.registrationForm.patchValue({
      userName: "Aditya",
      password: "test",
      confirmPassword: "test"
    });
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    this._registrationService
      .register(this.registrationForm.value)
      .subscribe(
        response => console.log("success", response),
        error => console.log("error", error)
      );
  }
}
