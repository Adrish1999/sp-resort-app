import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';

@NgModule({
    imports: [
        CommonModule
     ],
    declarations: [
        FooterComponent
    ],
    exports: [
        FooterComponent
    ]
})
export class SharedFooterModule {}