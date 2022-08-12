import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProductoDTO } from 'src/app/models/producto-dto';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { TokenService } from 'src/app/services/token/token.service';

//Excell
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-listado-componentes',
  templateUrl: './listado-componentes.component.html',
  styleUrls: ['./listado-componentes.component.scss'],
})
export class ListadoComponentesComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      value: null,
    },
  };
  //PRODUCTOS LISTADO
  productos: ProductoDTO[] = [];

  //PRODUCTO SELECCIONADO
  productoSelect: ProductoDTO[] = [];
  idProdSelect: string = '';
  codProdSelect: string = '';
  nombrProdSelect: string = '';

  //FILTRO BUSQUEDA PRODUCTOS
  filtroProdBusqueda: string = '';
  filtroProdCampo: string = '';

  //SEGURIDAD
  isAdmin = false;
  isUser = false;

  //PAGINADO

  //Pages
  nroPage = 0;
  isFirstPage = false;
  isLastPage = false;
  totalPages = 0;

  //Elements
  nroElements = 10;
  nroCurrentElements = 0;
  nroTotalElements = 0;

  //Caracteristicas
  orderBy = 'id';
  direction = 'asc';

  //ERRORES
  errMsj: string;

  constructor(
    private router: Router,
    private productoService: ProductosService,
    private tokenService: TokenService,
    private toast: NgToastService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.listarProductos();
    this.checkEliminarProducto();
  }

  //=========== SEGURIDAD ==============
  //Aplicada en productos.guard y agregada en el routing

  //=========== METODOS CRUD ==============

  //----------LISTADO PRODUCTOS ---------------
  listarProductos() {
    this.productoService
      .listado(this.nroPage, this.nroElements, this.orderBy, this.direction)
      .subscribe(
        (data: any) => {
          this.productos = data.content;
          this.isFirstPage = data.first;
          this.isLastPage = data.last;
          this.totalPages = data.totalPages;
          this.nroCurrentElements = data.numberOfElements;
          this.nroTotalElements = data.totalElements;
        },
        (err) => {

          this.errMsj = err.error.message;

          //TOAST ERROR
          setTimeout(() => {
            this.toast.error({
              detail: 'ERROR',
              summary: this.errMsj,
              duration: 2000,
            });
          }, 600);

          //FIN TOAST ERROR
          //console.log(err);
          //console.log('listado');

          this.refresh(3000);
        }
      );
  }

  //-----LISTADO PRODUCTOS FILTER/CAMPO ---------------
  listarProductosFilter() {
    this.productoService
      .listadoFilterAndField(
        this.filtroProdCampo,
        this.filtroProdBusqueda,
        this.nroPage,
        this.nroElements,
        this.orderBy,
        this.direction
      )
      .subscribe(
        (data: any) => {
          this.productos = data.content;
          this.isFirstPage = data.first;
          this.isLastPage = data.last;
          this.totalPages = data.totalPages;
          this.nroCurrentElements = data.numberOfElements;
          this.nroTotalElements = data.totalElements;

          //console.log(this.productos);
        },
        (err) => {
          this.errMsj = err.error.message;

          //TOAST ERROR
          setTimeout(() => {
            this.toast.error({
              detail: 'ERROR',
              summary: this.errMsj,
              duration: 2000,
            });
          }, 600);

          //FIN TOAST ERROR
          //console.log(err);
          //console.log('listado-filter');

          this.refresh(3000);
        }
      );
  }

  setFilter(filtro: string, campo: string, nroPag:number) {


    this.filtroProdCampo = '';
    this.filtroProdBusqueda = '';

    if (filtro === '' || filtro === null || campo === '' || campo === null) {
      this.listarProductos();
    } else {

      this.filtroProdCampo = campo;
      this.filtroProdBusqueda = filtro;
      this.nroPage = nroPag;

      this.listarProductosFilter();
    }
  }

  //----------DETALLES PRODUCTOS ---------------
  detalleProducto(producto: any): void {

    this.spinLoader(100);

    this.navigationExtras.state['value'] = producto;
    this.router.navigate(['detalles-componentes'], this.navigationExtras);
  }

  //----------EDITAR PRODUCTOS ---------------
  editarProducto(producto: any): void {

    this.spinLoader(100);

    this.navigationExtras.state['value'] = producto;
    this.router.navigate(['editar-componentes'], this.navigationExtras);
  }

  //----------CHECK ELIMINAR PRODUCTO----------
  checkEliminarProducto() {
    this.isAdmin = this.tokenService.isAdmin();
  }

  //----------ELIMINAR PRODUCTOS ---------------
  eliminarProducto(id: string): void {

    this.spinLoader(100);

    this.productoService.delete(id).subscribe(
      (data: any) => {

        this.toast.success({
          detail: 'Operación Exitosa',
          summary: 'Se ha Eliminado el Producto!!',
          duration: 2000,
        });

        console.log('Producto Eliminado');

        this.refresh(2100);
      },
      (err) => {
        this.errMsj = err.error.message;

        //TOAST ERROR
        setTimeout(() => {
          this.toast.error({
            detail: 'ERROR',
            summary: this.errMsj,
            duration: 2000,
          });
        }, 600);
        //FIN TOAST ERROR
        console.log(err);
      }
    );
  }

  //----------ELIMINAR PRODUCTOS ---------------
  eliminarProductoNoAuth(id: number): void {

    this.spinLoader(100);

    this.toast.error({
      detail: 'Operación No Autorizada',
      summary: 'Servicio Habilitado para administradores!!',
      duration: 2000,
    });

    this.refresh(2100);
  }









  //=============== UTILS ===============

  //---------------- RECARGAR -------------------
  refresh(ms: number) {
    setTimeout(() => {
      window.location.reload();
    }, ms);
  }

  //---------- RUEDA DE CARGA ------------
   spinLoader(ms: number) {
    //SPIN LOADING
    this.ngxService.start();
    setTimeout(() => {
      this.ngxService.stop();
    }, ms);
    //FIN SPIN LOADING
  }

  //------------- REDIRECCIONAR -------------------
  redirect(page: String) {
    this.router.navigate([page]);
  }

  //-----------  ID PRODUCTO SELECT-------------

  setProductoSelect(producto: ProductoDTO) {
    this.idProdSelect = producto.id;
    this.codProdSelect = producto.codigo;
    this.nombrProdSelect = producto.nombre;

    console.log('Producto Seleccionado: ', producto);
  }

  //---------- GENERATE EXCEL ----------
  name = 'listaProductos.xlsx';

  generateExcel(): void {
    let element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

  //=========== METODOS PAGINACION ==============

  //Ordenar los registros por type
  orderByDirection(type: string, direct: string): void {
    this.orderBy = type;
    this.direction = direct;

    if (this.filtroProdBusqueda === '' || this.filtroProdBusqueda === null) {
      this.listarProductos();
    } else {
      this.listarProductosFilter();
    }
  }

  //Pagina Anterior
  paginaAnterior(): void {
    if (this.filtroProdBusqueda === '' || this.filtroProdBusqueda === null) {
      if (this.nroPage != 0 && this.nroPage > 0) {
        this.nroPage--;
        this.listarProductos();
      } else {
        //TOAST ERROR
        setTimeout(() => {
          this.toast.error({
            detail: 'ERROR',
            summary: 'No es Posible Disminuir una Página!!',
            duration: 2000,
          });
        }, 600);
        //FIN TOAST ERROR
      }
    }
  }

  //Pagina Anterior
  paginaSiguiente(): void {
    if (this.filtroProdBusqueda === '' || this.filtroProdBusqueda === null) {
      if (!this.isLastPage && this.nroPage >= 0) {
        this.nroPage++;
        this.listarProductos();
      } else {
        //TOAST ERROR
        setTimeout(() => {
          this.toast.error({
            detail: 'ERROR',
            summary: 'No es Posible Aumentar una Página!!',
            duration: 2000,
          });
        }, 600);
        //FIN TOAST ERROR
      }
    }
  }

  cambiarPagina(pagina: number): void {

    this.nroPage = pagina;

    if (this.filtroProdBusqueda === '' || this.filtroProdBusqueda === null) {
      this.listarProductos();
    } else {
     this.listarProductosFilter();
    }
  }

  //=============== PRODUCTOS POR GRUPO =============
  countProdByGroup(): void {
    //this.nroProdAgua = this.productos.find.g
  }
}
