import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subject } from 'rxjs';
import { ProductoDTO } from 'src/app/models/producto-dto';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { TokenService } from 'src/app/services/token/token.service';

highcharts3D(Highcharts);

@Component({
  selector: 'app-graficos-componentes',
  templateUrl: './graficos-componentes.component.html',
  styleUrls: ['./graficos-componentes.component.scss'],
})
export class GraficosComponentesComponent implements OnInit {
  navigationExtras: NavigationExtras = {
    state: {
      value: null,
    },
  };

  //PRODUCTOS LISTADO
  productos: ProductoDTO[] = [];

  //FILTRO BUSQUEDA PRODUCTOS
  filtroProdCampo: string = 'categoria';
  filtroProdBusqueda: string = '';

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

  nombresProductos: string[] = [];
  campos: string[] = [
    'Gamer',
    'Monitores',
    'Notebook',
    'Celulares',
    'Tablet',
    'Plac. Electr.',
    'Microntr.',
    'Generales',
    'Redes',
  ];

  //Stock
  nroStockGamer: number = 0;
  nroStockMonitores: number = 0;

  stock: number[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';
  chartOptions: Highcharts.Options = {};

  constructor(
    private router: Router,
    private productoService: ProductosService,
    private tokenService: TokenService,
    private toast: NgToastService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {

    this.stockGamer();
    this.stockMonitores();
    this.loadStock();
    console.log(this.stock);
    this.generateChart();

  }

  //=============METODOS CRUD========================

  //-----LISTADO PRODUCTOS FILTER GAMER ---------------
  stockGamer() {
    const filtro: string = 'Gamer';

    this.filtroProdBusqueda = filtro;

    this.productoService
      .listadoFilterAndField(
        this.filtroProdCampo,
        this.filtroProdBusqueda,
        this.nroPage,
        this.nroElements,
        this.orderBy,
        this.direction
      )
      .subscribe((data: any) => {

        this.nroStockGamer = data.numberOfElements;

      });

  }

  //-----LISTADO PRODUCTOS FILTER MONITORES ---------------
  stockMonitores() {
    const filtro: string = 'Monitores';

    this.filtroProdBusqueda = filtro;

    this.productoService
      .listadoFilterAndField(
        this.filtroProdCampo,
        this.filtroProdBusqueda,
        this.nroPage,
        this.nroElements,
        this.orderBy,
        this.direction
      )
      .subscribe((data: any) => {

        this.nroStockMonitores = data.numberOfElements;

        //this.nroStockMonitores = data.numberOfElements;

      });

  }


  loadStock(){
      this.stock[0] = this.nroStockGamer;
      this.stock[1] = this.nroStockMonitores;


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

  //-------------------- HIGHCHART -----------------

  generateChart() {


    //setTimeout(() => {


    this.chartOptions = {
      chart: {
        height: 510,
        width: 650,
        type: 'column',

        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25,
        },
        events:{
          load: function() {
            var series = this.series[0],
            last = series.data[series.data.length - 1];
            setInterval(function() {
              //var p1 = Math.random() * 3;
              //series.addPoint(p1);
              series.addPoint(this.stock);
            }, 1000)
        }
      }
      },
      title: {
        text: 'Stock de Productos Por Categoría',
      },
      subtitle: {
        text: 'Ordenados por Cantidad de Mayor a Menor',
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: {
        //categories: [[${keySetCateg}]],
        //categories:{listadoProductos()},
        //categories: this.nombresProductos,
        categories: this.campos,
        crosshair: true,
        title: {
          text: 'Categorías',
        },
      },
      yAxis: {
        title: {
          text: 'Cantidad',
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          depth: 25,
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y: f} u',
          },
        },
      },

      tooltip: {
        headerFormat: '<span style="font-size:20px">{point.key}</span><br>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">Stock : </td>' +
          '<td style="padding:0"><b> {point.y: f} unidades</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      series: [
        {
          name: 'Unidades por Marca',
          type: 'column',
          dataSorting: {
            enabled: true,
          },
          data: this.stock,
          color: '#5F96F3',
        },
      ],
    };


 // }, 600);


  }
}

