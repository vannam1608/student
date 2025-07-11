// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';
import { studentGuard } from './shared/guards/student.guard';

// Layouts
import { AdminLayoutComponent } from './shared/layout/admin-layout/admin-layout.component';
import { StudentLayoutComponent } from './shared/layout/student-layout/student-layout.component';

// Admin components
import { DashboardComponent as AdminDashboard } from './admin/dashboard/dashboard.component';
import { StudentListComponent } from './admin/student-management/student-list/student-list.component';
import { StudentFormComponent } from './admin/student-management/student-form/student-form.component';
import { StudentDetailComponent } from './admin/student-management/student-detail/student-detail.component';

import { SubjectListComponent } from './admin/subject-management/subject-list/subject-list.component';
import { SubjectFormComponent } from './admin/subject-management/subject-form/subject-form.component';
import { SubjectDetailComponent } from './admin/subject-management/subject-detail/subject-detail.component';
import { SubjectStudentsComponent } from './admin/subject-management/subject-students/subject-students.component';

import { ScoreListComponent } from './admin/score-management/score-list/score-list.component';
import { InputScoreComponent } from './admin/score-management/input-score/input-score.component';

// Student components
import { DashboardComponent as StudentDashboard } from './student/dashboard/dashboard.component';
import { ProfileEditComponent } from './student/profile-edit/profile-edit.component';
import { SubjectRegisterComponent } from './student/subject-register/subject-register.component';
import { ScheduleScoreComponent } from './student/schedule-score/schedule-score.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // 🛡️ Admin area
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: AdminDashboard },

      // 🎓 Student Management
      { path: 'students', component: StudentListComponent },
      { path: 'students/add', component: StudentFormComponent },
      { path: 'students/edit/:id', component: StudentFormComponent },
      { path: 'students/detail/:id', component: StudentDetailComponent },

      // 📘 Subject Management
      { path: 'subjects', component: SubjectListComponent, runGuardsAndResolvers: 'always' },
      { path: 'subjects/add', component: SubjectFormComponent },
      { path: 'subjects/edit/:id', component: SubjectFormComponent },
      { path: 'subjects/detail/:id', component: SubjectDetailComponent },
      { path: 'subjects/:id/students', component: SubjectStudentsComponent },
      { path: 'subjects/:id/register-student', loadComponent: () => import('./admin/subject-management/subject-register-student/subject-register-student.component').then(m => m.SubjectRegisterStudentComponent) },
      { path: 'subjects/search', loadComponent: () => import('./admin/subject-management/subject-search/subject-search.component').then(m => m.SubjectSearchComponent) },

      // 📝 Score Management
      { path: 'scores', component: ScoreListComponent },
      { path: 'scores/input', component: InputScoreComponent }
    ]
  },

  // 🎓 Student area
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [authGuard, studentGuard],
    children: [
      { path: '', component: StudentDashboard },
      { path: 'profile', component: ProfileEditComponent },
      { path: 'register-subjects', component: SubjectRegisterComponent },
      { path: 'schedule-score', component: ScheduleScoreComponent },
      { path: 'user-info', loadComponent: () => import('./student/user-info/user-info.component').then(c => c.UserInfoComponent) },
      { path: 'progress', loadComponent: () => import('./student/student-progress/student-progress.component').then(m => m.StudentProgressComponent) }
    ]
  },

  // 🌐 Redirects
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
