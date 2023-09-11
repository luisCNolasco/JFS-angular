import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-dialog-patient',
  templateUrl: './dialog-patient.component.html',
  styleUrls: ['./dialog-patient.component.css']
})
export class DialogPatientComponent {

  form: FormGroup;
  id: number;

  patient: Patient

  constructor(
    private patientService: PatientService,
    public dialogRef: MatDialogRef<DialogPatientComponent>
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      idPatient: new FormControl(0),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      dni: new FormControl('', [Validators.required, Validators.minLength(8)]),
      address: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(9)]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    const patient: Patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    this.patientService.save(patient)
      .subscribe(data => {     
        this.patientService.setMessageChange('INSERTED!');   
      });
      
      this.close()
  }

  close() {
    this.dialogRef.close('OK')
  }
}
