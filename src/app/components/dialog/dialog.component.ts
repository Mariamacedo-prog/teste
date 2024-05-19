import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  text = '';
  title = 'ATENÇÃO';
  positiveButton = 'Sim';
  negativeButton = 'Cancelar';


  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(){
     this.text = this.data.text;
     if(this.data.positiveButton){
      this.positiveButton = this.data.positiveButton;
     }

     if(this.data.title){
      this.title = this.data.title;
     }

     if(this.data.negativeButton){
      this.negativeButton = this.data.negativeButton;
     }
    }

    onYesClick(): void {
      this.dialogRef.close(true);
    }

    onCancelClick(): void {
      this.dialogRef.close(false);
    }
}
