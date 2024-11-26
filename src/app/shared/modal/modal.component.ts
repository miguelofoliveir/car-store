import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title?: string;
      component: any;
      inputs?: { [key: string]: any };
    }
  ) {}

  createInjector(): Injector {
    return Injector.create({
      providers: Object.keys(this.data.inputs || {}).map((key) => ({
        provide: key,
        useValue: this.data.inputs![key],
      })),
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
