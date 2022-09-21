import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './services/guards/auth/login.guard';
import { ProductosGuard } from './services/guards/productos/productos.guard';

const routes: Routes = [


  {path:'', loadChildren: () => import('./pages/electronica/auth/login/login/login.module').then(m => m.LoginModule) },


  { path: 'login', loadChildren: () => import('./pages/electronica/auth/login/login/login.module').then(m => m.LoginModule)  , canActivate : [LoginGuard] },


  { path: 'signin', loadChildren: () => import('./pages/electronica/auth/signin/signin/signin.module').then(m => m.SigninModule) , canActivate : [LoginGuard] },


  { path: 'inicio-componentes', loadChildren: () => import('./pages/electronica/inicio-componentes/inicio-componentes.module').then(m => m.InicioComponentesModule) },


  { path: 'listado-componentes', loadChildren: () => import('./pages/electronica/listado-componentes/listado-componentes.module').then(m => m.ListadoComponentesModule)  },

  { path: 'detalles-componentes', loadChildren: () => import('./pages/electronica/detalles-componentes/detalles-componentes.module').then(m => m.DetallesComponentesModule) },


  { path: 'editar-componentes', loadChildren: () => import('./pages/electronica/editar-componentes/editar-componentes.module').then(m => m.EditarComponentesModule)  },


  { path: 'agregar-componentes', loadChildren: () => import('./pages/electronica/agregar-componentes/agregar-componentes.module').then(m => m.AgregarComponentesModule)  },


{ path: 'graficos-componentes', loadChildren: () => import('./pages/electronica/graficos-componentes/graficos-componentes.module').then(m => m.GraficosComponentesModule)  },


  { path: 'novedades-componentes', loadChildren: () => import('./pages/electronica/novedades-componentes/novedades-componentes.module').then(m => m.NovedadesComponentesModule) },


  { path: 'ayuda', loadChildren: () => import('./pages/utilidades/ayuda/ayuda.module').then(m => m.AyudaModule)  },

  { path: '**', loadChildren: () => import('./pages/electronica/auth/login/login/login.module').then(m => m.LoginModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
