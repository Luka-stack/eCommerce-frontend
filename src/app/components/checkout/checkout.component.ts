import { State } from './../../common/state';
import { Country } from './../../common/country';
import { FormService } from './../../services/form.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] = [];
  billingAddressStates: State[] = [];
  shippingAddressStates: State[] = [];

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  checkoutFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private formService: FormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.pattern(
          '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
        )])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2)]),
        city: new FormControl('', [Validators.required, Validators.minLength(2)]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(3)])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2)]),
        city: new FormControl('', [Validators.required, Validators.minLength(2)]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2)]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{13,19}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      }),
    });

    this.formService.getCreditCardMonths(new Date().getMonth() + 1).subscribe(
      data => {
        this.creditCardMonths = data;
        this.checkoutFormGroup.get('creditCard.expirationMonth').setValue(data[0])
      }
    );
    this.formService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data
        this.checkoutFormGroup.get('creditCard.expirationYear').setValue(data[0])
      }
    );

    this.formService.getCountries().subscribe(
      data => this.countries = data
    );
  }

  // Customer
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  // Shipping Address
  get shipStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shipCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shipState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shipZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shipCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  // Billing Address
  get billStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  // Card
  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  fillBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
          .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() { 
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    
    this.formService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        formGroup.get('state').setValue(data[0]);
      }
    )
  }
}
