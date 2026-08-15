import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard';
import { RegisterComponent } from './components/register/register';
import { TransactionsComponent } from './components/transactions/transactions';
import { EmployeeComponent } from './components/employee/employee';
import { LoginComponent } from './components/login/login';
import { AuthService } from './services/auth.service';

// Guard for logged in users (Customers or Employees)
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

// Guard for Employees only
const employeeGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isEmployee()) {
    return true;
  }

  if (authService.isLoggedIn()) {
    // Logged in as customer, redirect to customer dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  // Not logged in at all, redirect to login page (root)
  router.navigate(['/']);
  return false;
};

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [employeeGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [employeeGuard] },
  { path: 'employee', component: EmployeeComponent, canActivate: [employeeGuard] },
  { path: '**', redirectTo: '' }
];
