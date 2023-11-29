import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAndDisplayRoomsComponent } from './add-and-display-rooms/add-and-display-rooms.component';
import { AdminConsoleComponent } from './admin-console.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminConsoleComponent,
    canActivate: [AuthGuard],
    children: [
        {
            path: 'addRoom',
            component: AddAndDisplayRoomsComponent
        },
        {
          path: '',
          redirectTo: '/admin',
          pathMatch: 'full'
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
