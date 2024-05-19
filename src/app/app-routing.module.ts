import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},

  // Rotas de prefeitura
  { path: 'prefeitura', loadChildren: () => import('./pages/prefeitura/prefeitura.module').then(m => m.PrefeituraModule) },

  // Rotas de usuario
  { path: 'usuario', loadChildren: () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule) },

  // Rotas de funcionario
  { path: 'funcionario', loadChildren: () => import('./pages/funcionarios/funcionarios.module').then(m => m.FuncionariosModule) },

  // Rotas de contratante
  { path: 'contratante', loadChildren: () => import('./pages/contratantes/contratantes.module').then(m => m.ContratantesModule) },
  
  // Rotas de vendedor
  { path: 'vendedor', loadChildren: () => import('./pages/vendedores/vendedores.module').then(m => m.VendedoresModule) },

  // Rotas de acesso
  { path: 'acesso', loadChildren: () => import('./pages/acessos/acessos.module').then(m => m.AcessosModule) },

  // Rotas de contrato
  { path: 'contrato', loadChildren: () => import('./pages/contratos/contratos.module').then(m => m.ContratosModule) },

  // Rotas de vendasPagamentos
  { path: 'vendasPagamentos', loadChildren: () => import('./pages/vendas-pagamentos/vendas-pagamentos.module').then(m => m.VendaPagamentoModule) },

  // Rotas de cartorio
  { path: 'cartorio', loadChildren: () => import('./pages/cartorio/cartorio.module').then(m => m.CartorioModule) },

  // Rotas de imovel
  { path: 'imovel', loadChildren: () => import('./pages/imoveis/imovel.module').then(m => m.ImovelModule) },

];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
