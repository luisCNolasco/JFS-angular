import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignoService } from 'src/app/service/signo.service';
import { switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogPatientComponent } from 'src/app/components/dialog-patient/dialog-patient.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signo-editar',
  templateUrl: './signo-editar.component.html',
  styleUrls: ['./signo-editar.component.css']
})
export class SignoEditarComponent {

  form: FormGroup;
  id: number;
  isEdit: boolean;

  minDate: Date = new Date();
  dateSelected: Date;

  patients: Patient[] = []

  constructor(
    private signoService: SignoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private patientService: PatientService,
    private dialog: MatDialog,
    private _snackBar:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idSigno: [0],
      fecha: ['', Validators.required],
      temperatura: ['', [Validators.required]],
      pulso: ['', [Validators.required]],
      ritmo: ['', [Validators.required]],
      patient: this.fb.group({
        idPatient :['', [Validators.required]]
      }),
    })

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });

    this.patientService.getPatientChange().subscribe(data =>{
      this.patients = data
    })

    this.patientService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
    });

    this.listPatients()
  }

  initForm() {
    if (this.isEdit) {
      this.signoService.findById(this.id).subscribe((data) => {
        this.form.patchValue(data)
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    const signo = this.form.value
    
    if (this.form.valid) {
      
      if (this.isEdit) {
        this.signoService.update(this.id, signo).subscribe(() => {
          this.signoService.findAll().subscribe(data => {
            this.signoService.setSignoChange(data);
            this.signoService.setMessageChange('UPDATED!');
          });
        });
      } else {
        this.signoService.save(signo).pipe(switchMap(() => {
          return this.signoService.findAll();
        }))
          .subscribe(data => {
            this.signoService.setSignoChange(data);
            this.signoService.setMessageChange('INSERTED!');
          });
      }
      this.router.navigate(['/pages/signos'])
    }else{
      this.form.markAllAsTouched()
    }

  }

  listPatients() {
    this.patientService.findAll().subscribe(data => {
      this.patientService.setPatientChange(data)
    })
  }

  changeDate(e: any) {
  }

  addPatient() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = '500px'
    let res = this.dialog.open(DialogPatientComponent, dialogConfig)
    
    res.afterClosed().subscribe(rs => {
      if (rs == 'OK') {
        this.listPatients()
      }
    })
  }
  
  cancel(){
    this.router.navigateByUrl('/pages/signos')
  }
}
