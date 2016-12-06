

function comp_financiamento(np,i,pv, cmbTabela) {
  var cmbTabela;
  switch (cmbTabela.selectedIndex) {
    case 2:
      tabela = comp_price(np,i,pv);
      break;
    case 1:
      tabela = comp_sac(np,i,pv);
      break;
    default:
      throw "comp_financiamento: cmbTabela.selectedIndex invalido!";
  }
if (tabela != null) {
    tabela.header = ["#","Pagamentos","Amortizações","Juros","Saldo Devedor"];
  
    var html = "<table class='numbers'>";
    html += '<tr><th>'+tabela.header[0]+'</th><th>'+tabela.header[1]+'</th><th>'+tabela.header[2]+'</th><th>'+tabela.header[3]+'</th><th>'+tabela.header[4]+'</th></tr>';
    for (ii in tabela.linhas) {
      var lin = tabela.linhas[ii];
      html += '<tr><th>'+lin[0]+'</th><td>'+lin[1]+'</td><td>'+lin[2]+'</td><td>'+lin[3]+'</td><td>'+lin[4]+'</td></tr>';   
    }
    html += '<tr><th>'+tabela.footer[0]+'</th><td>'+tabela.footer[1]+'</td><td>'+tabela.footer[2]+'</td><td>'+tabela.footer[3]+'</td><th>'+tabela.footer[4]+'</th></tr></table>';
    
    document.getElementById('sac_result').innerHTML = html;
  }

}
  function comp_sac(np,i,pv) {
  var tabela = new Tabela();

 
  var j = 0;
  var amortizacao = pv/np;
  var totalJuros = 0;
  var totalAmort = 0;
  var totalParc = 0;
  for (j=0; j<np; j++) {
    var parcela = amortizacao + pv*i;
    tabela.linhas.push([(j+1), parcela.toFixed(2), amortizacao.toFixed(2), (pv*i).toFixed(2), (pv-amortizacao).toFixed(2)]);
    totalJuros += pv*i;
    totalAmort += amortizacao;
    totalParc += parcela;
    pv -= amortizacao;
  }
  tabela.footer = [" » ", totalParc.toFixed(2), totalAmort.toFixed(2), totalJuros.toFixed(2),"« TOTAIS"];
  
  return tabela;

}

  function comp_price(np, i,pv) {
  var tabela = new Tabela();

  var j = 0;
  var parcela = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;

  var totalJuros = 0;
  var totalAmort = 0;
  var totalParc = 0;
  for (j=0; j<np; j++) {
    var amortizacao = parcela-pv*i;
    tabela.linhas.push([(j+1).toFixed(2), parcela.toFixed(2), amortizacao.toFixed(2), (pv*i).toFixed(2), (pv-amortizacao).toFixed(2)]);
    totalJuros += pv*i;
    totalAmort += amortizacao;
    totalParc += parcela;
    pv -= amortizacao;
  }
  
  tabela.footer = [" » ", totalParc.toFixed(2), totalAmort.toFixed(2), totalJuros.toFixed(2),"« TOTAIS"];
  return tabela;

}

function Tabela() {
  this.header = [];
  this.linhas = [];
  this.footer = [];
}

function calcula(form) {
    var e = form.cmbTipo;
    if(e!=null)
      var tipo = e.options[e.selectedIndex].value;
     
    var f = form.cmbTabela;
    var tabela = f.options[f.selectedIndex].value;

     var prest;                                          // Valor da prestação
     var pv      = form.valor.value;                       // Valor presente
     var i       = form.taxa.value / 100;                     // Taxa de Juro
     var np      = form.prestacoes.value;          // Numero de Prestações
     var entrada = form.entrada.value;          // Entrada

    var quantidadeParcelasPagas = form.parcelasPagas.value;

    if (tipo == 1) {                                       
       //1 Calcular valor de prestações
       
       if(tabela==1){
           //SAC
           var n = np;
           var A = pv/np;
           var k = quantidadeParcelasPagas;
           prest = (n-k+1)*i*A;
           form.resposta.value = prest.toFixed(2);
       }else {
           //PRICE
           
            prest       = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;
            form.resposta.value = prest.toFixed(2);
       }
       
            comp_financiamento(np,i,pv, form.cmbTabela);
 
    }
    else if(tipo==2){
       // 2.  Calcular saldo devedor / a. Parcela atual paga;


        if(tabela==1){
           //SAC
           /**
           *Sd = (n-t)*a
           **/

           //Calcula o Valor da amortização que é constante na tabela SAC
            var amortizacao = pv/np;

            //Calcula o Saldo devedor
            saldoDevedor = (np-quantidadeParcelasPagas)*amortizacao;
            form.resposta.value = saldoDevedor.toFixed(2);

       }else {
            //PRICE
           var saldoDevedor;     
           var quantidadeParcelasPagas = form.parcelasPagas.value;
           prest                       = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;
          // saldoDevedor =   prest*fvaPrice();// pv-(prest*quantidadeParcelasPagas)
            
          var n        = parseFloat(np-quantidadeParcelasPagas);
          var ind      = parseFloat(1+i);
          var base     = parseFloat(Math.pow(ind,n));
          var cima     = parseFloat((base-1));
          var baixo    = parseFloat((base*i));
          var fva      = parseFloat((cima/baixo));
          saldoDevedor = prest*fva
            form.resposta.value = saldoDevedor.toFixed(2);
        }
                     comp_financiamento(np,i,pv, form.cmbTabela);
  

    }
    else if(tipo==3){
        // 2.  Calcular saldo devedor /b.   Parcela atual pendente;


        if(tabela==1){
           //SAC

           /**
           *Sd = (n-t)*a
           **/

           //Calcula o Valor da amortização que é constante na tabela SAC
            var amortizacao = pv/np;

            //Calcula o Saldo devedor
            saldoDevedor = (np-quantidadeParcelasPagas)*amortizacao;
            form.resposta.value = saldoDevedor.toFixed(2);

       }else {
           //PRICE
           var saldoDevedor;     
           var quantidadeParcelasPagas = form.parcelasPagas.value;
           prest                       = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;
          // saldoDevedor =   prest*fvaPrice();// pv-(prest*quantidadeParcelasPagas)
            
          var n        = parseFloat(np-quantidadeParcelasPagas);
          var ind      = parseFloat(1+i);
          var base     = parseFloat(Math.pow(ind,n));
          var cima     = parseFloat((base-1));
          var baixo    = parseFloat((base*i));
          var fva      = parseFloat((cima/baixo));
          saldoDevedor = prest*fva

            form.resposta.value = saldoDevedor.toFixed(2);
        }
                    comp_financiamento(np,i,pv, form.cmbTabela);

    }
    else if(tipo==4){
        //3.    Calcular parcela de Juros em um mês especifico /a.  Calcular a primeira parcela
        if(tabela==1){
           //SAC
            parcelaJuros       = i*pv;
            form.resposta.value = parcelaJuros.toFixed(2);
       }else {
           //PRICE
            var parcelaJuros;                                          // Valor da prestação
            /*var pv      = form.valor.value;                       // Valor presente
            var i       = form.taxa.value / 1200;                     // Taxa de Juro
           //    var mes     = form.mes.value;
            //var tipo      = form.tipo.selectedIndex;                  // Numero de Anos Seleccionado
            var np      = form.prestacoes.value;          // Numero de Prestações
            var entrada = form.entrada.value;          // Entrada*/
            parcelaJuros       = i*pv//Math.round((pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i );
            form.resposta.value = parcelaJuros.toFixed(2);
            //alert("O valor da mensalidade é " + prest);
        }
                    comp_financiamento(np,i,pv, form.cmbTabela);

    }
    else if(tipo==5){
        ////3.    Calcular parcela de Juros em um mês especifico - b.   Calcular uma parcela corrente;       
       if(tabela==1){
           //SAC
            var amortizacao = pv/np;;
            var parcelaJuros = (np-quantidadeParcelasPagas+1)*i*  amortizacao;          
            form.resposta.value = parcelaJuros.toFixed(2);
       }else {
           //PRICE
                var parcelaJuros;                                          // Valor da prestação
                var restante, parcelaAmortizada;
                var a1;

                parcela     = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;
                a1 = parcela-(i*pv);
                parcelaAmortizada =  a1*Math.pow((1+i), (quantidadeParcelasPagas-1));
                parcelaJuros  = parcela-parcelaAmortizada;
                form.resposta.value = parcelaJuros.toFixed(2);
        }
    }
    else if(tipo==6){
        //4.    Calcular parcela de amortização em um mês especifico; - a.  Calcular do início até hoje;  
       if(tabela==1){
           //SAC
             //Calcula o Valor da amortização que é constante na tabela SAC
            var amortizacao = pv/np;
            form.resposta.value = amortizacao;
       }else {
           //PRICE
            var parcelaJuros;                                          // Valor da prestação
                var restante, parcelaAmortizada;
                var a1;
                parcela     = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;
                a1 = parcela-(i*pv);
                parcelaAmortizada =  a1*Math.pow((1+i), (quantidadeParcelasPagas-1));
           
            form.resposta.value = parcelaAmortizada.toFixed(2);

       }
                   comp_financiamento(np,i,pv, form.cmbTabela);
                   
    }
    else if(tipo==7){
        //4.    Calcular parcela de amortização em um mês especifico;  -  b.    Calcular em período especifico;
       
        if(tabela==1){
           //SAC
            //Calcula o Valor da amortização que é constante na tabela SAC
            var amortizacao = (pv/np)*(fim-inicial);
            form.resposta.value = amortizacao.toFixed(2);
       }else {
           //PRICE
              var prest;        
              var parcelaJuros;  
              var parcelaCalculo = form.parcelaCalculo.value;
                                                     // Valor da prestação
                var restante, parcelaAmortizada;
                var a1;
                parcela     = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;
                a1 = parcela-(i*pv);
                parcelaAmortizada =  a1*Math.pow((1+i), (parcelaCalculo-1));
           
            form.resposta.value = parcelaAmortizada.toFixed(2);
        }
                    comp_financiamento(np,i,pv, form.cmbTabela);

    }
    else if(tipo==8){
        //5.    Calcular valor das amortizações acumuladas; a.  Calcular do início até hoje;
           if(tabela==1){
                    //SAC
                    //Calcula o Valor da amortização que é constante na tabela SAC
                    var  amortizacaoAcumulada = (pv/np)*quantidadeParcelasPagas;
                    //amortizacaoAcumulada = amortizacaoAcumulada + amortizacao;
                    form.resposta.value = amortizacaoAcumulada.toFixed(2);
                 }else {
                    //PRICE
                    var prest;        
                    var somaAmortizaca;
                     // Valor da prestação
                    prest       = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;
                    somaAmortizacao = prest*(fvaPrice()-fvatPrice());
                    
                                                     
                    form.resposta.value = somaAmortizacao.toFixed(2);

          }
                      comp_financiamento(np,i,pv, form.cmbTabela);


    }
    else if(tipo==9){
        //5.    Calcular valor das amortizações acumuladas;  -b.    Calcular em período especifico;
        var inicial = form.inicial.value;
        var fim = form.fim.value

        if(tabela==1){
           //SAC
                     //Calcula o Valor da amortização que é constante na tabela SAC
                    var  amortizacaoAcumulada = (pv/np)*(fim-inicial);
                    //amortizacaoAcumulada = amortizacaoAcumulada + amortizacao;
                    form.resposta.value = amortizacaoAcumulada.toFixed(2);
       }else {
           //PRICE
             
                    var prest;        
                    var somaAmortizaca;
                     // Valor da prestação
                    prest       = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;
                    somaAmortizacao = prest*(fvaPrice()-fvatPrice());
                    
                                                     
                    form.resposta.value = somaAmortizacao.toFixed(2);
       }
                           comp_financiamento(np,i,pv, form.cmbTabela);

     }
    else if(tipo==10){ ///Calculo de valor de juros acumulados até um determinado periodo
        if(tabela==1){
          //SAC


        }else{
          //PRICE
            var somaJuros;

            //somaJuros = r*(t-fva*(i*n))*fva*(i*n*t));
        }
                            comp_financiamento(np,i,pv, form.cmbTabela);

    }
    else if(tipo==11){ ///Calculo de valor de juros acumulados entre periodo
        if(tabela==1){
          //SAC

            //form.resposta.value 
        }else{
          //PRICE
           var somaJuros;

            //somaJuros = r*(fva*(i*n-t)-fva*(i*n-(t+k));
            form.resposta.value  = somaJuros.toFixed(2);
        }
                    comp_financiamento(np,i,pv, form.cmbTabela);

    
    } else {                                               // ALD Automóvel
        var prest;                                         // Valor da prestação
        var vc = form.aldmontante.value;                   // Valor do carro
        var eix = form.aldentrada.selectedlndex;           // Entrada seleccionada
        var ei = form.aldentrada.options[eix].text;        // Entrada Inicial
        var pv = vc * (1-ei/100);                          // Valor do Empréstimo
        var i = form.aldjuro.value /1200;                  // Taxa de Juro
        var ix = form.aldnmeses.selectedlndex;             // Numero de Meses seleccionado
        var np = form.aldnmeses.options[ix].text;          // Numero de Prestações
 
        prest = (pv * (Math.pow(1+i,np)) ) / (Math.pow(1+i,np)-1)* i ;
        form.aldmens.value = prest;
     }
}

///******PRICE*********/
function kPrice()
{
  var periodo = document.calcform.periodo.value;
  var k = document.calcform.periodok.value;
  var res = parseFloat(k-periodo);
  return res;
}

function fvaPrice()
{
  var parcelas = form.prestacoes.value;          // Numero de Prestações;
  var capital  = form.valor.value;                       // Valor presente
  var inicial  = form.inicial.value;
  var fim      = form.fim.value
  var periodo  = fim-inicial;
  var i        = form.taxa.value/100;                       // Valor presente
  var quantidadeParcelasPagas = form.parcelasPagas.value;

        
if(fim==0){
    fim = quantidadeParcelasPagas;
  }
  if(inicial==0){
    inicial= 0;
  }
  var n        = parseFloat(parcelas);
  var ind      = parseFloat(1+i);
  var base     = parseFloat(Math.pow(ind,n));
  var cima     = parseFloat((base-1));
  var baixo    = parseFloat((base*i));
  var res      = parseFloat((cima/baixo));
  
  return res;
}

function fvatPrice()
{
  var parcelas = form.prestacoes.value;          // Numero de Prestações;
  var capital  = form.valor.value;                       // Valor presente
  var inicial  = form.inicial.value;
  var fim      = form.fim.value
  var quantidadeParcelasPagas = form.parcelasPagas.value;

  if(fim==0){
    fim = quantidadeParcelasPagas;
  }
  if(inicial==0){
    inicial= 0;
  }
  var periodo  = fim-inicial;
  var i        = form.taxa.value/100;                       // Valor presente

  var t = parseFloat(parcelas);
  var p = parseFloat(periodo);
  var n = parseFloat(t-p);
  var ind = parseFloat(1+i);
  var base = parseFloat(Math.pow(ind,n));
  var cima = parseFloat((base-1));
  var baixo = parseFloat((base*i));
  var res = parseFloat((cima/baixo));
  
  return res; 
}

function fvatkPrice()
{
  var parcelas = document.calcform.parcelas.value;
  var taxa = document.calcform.taxa.value;
  var capital = document.calcform.capital.value;
  var periodo = document.calcform.periodo.value;
  var valork = document.calcform.periodok.value;
  
  var pk = parseFloat(valork);
  var i = parseFloat((taxa/100));
  var t = parseFloat(parcelas);
  var p = parseFloat((periodo));
  var k = parseFloat(pk-p);
  var faz = parseFloat((t-p));
  var n = parseFloat((faz-k));
  var ind = parseFloat(1+i);
  var base = parseFloat(Math.pow(ind,n));
  var cima = parseFloat((base-1));
  var baixo = parseFloat((base*i));
  var res = parseFloat((cima/baixo));
  
  return res; 
}

function frcPrice()
{
  var parcelas = document.calcform.parcelas.value;
  var taxa = document.calcform.taxa.value;
  var capital = document.calcform.capital.value;
  var periodo = document.calcform.periodo.value;

  var i = parseFloat((taxa/100));
  var n = parseFloat(parcelas);
  
  var ind = parseFloat(1+i);
  var base = parseFloat(Math.pow(ind,n));
  var baixo = parseFloat((base-1));
  var cima = parseFloat((base*i));
  var res = parseFloat((cima/baixo)); 
  
  return res; 
}

//Sistemas Price

function valorParcelaPrice()
{
  var parcelas = document.calcform.parcelas.value;
  var taxa = document.calcform.taxa.value;
  var capital = document.calcform.capital.value;
  var periodo = document.calcform.periodo.value;

  var dinheiro = parseFloat(capital);
  var divido = FRC();           
  var valparcela = (dinheiro*divido).toFixed(2);
  document.calcform.valorparcela.value = valparcela;
  return valparcela;
}
function saldoDevedorTPrice()
{
  var parcelas = document.calcform.parcelas.value;
  var taxa = document.calcform.taxa.value;
  var capital = document.calcform.capital.value;
  var periodo = document.calcform.periodo.value;
  
  var dinheiro = parseFloat(capital);
  var tempo = parseFloat(parcelas);
  var i = (parseFloat(taxa)/100);   
  var ind = (1+i);  
  var peratual = parseFloat(periodo);
  var ntmenos = parseFloat((tempo-peratual));
  
  var base = Math.pow(ind,ntmenos);
  var baixo = (base*i);
  var cima = (base-1);
  var divido = (cima/baixo);
  var valorparcela = ValorParcela();
  var saldodevedor = (valorparcela*(divido)).toFixed(2);
  document.calcform.saldodevedort.value = saldodevedor;
  return saldodevedor;
}
function saldoDevedorTmenosumPrice()
{
  var parcelas = document.calcform.parcelas.value;
  var taxa = document.calcform.taxa.value;
  var capital = document.calcform.capital.value;
  var periodo = document.calcform.periodo.value;  
  var dinheiro = parseFloat(capital);
  var tempo = parseFloat(parcelas);
  var i = (parseFloat(taxa)/100);   
  var ind = (1+i);  
  var peratual = parseFloat(periodo);

  var tmenosum = (tempo-(peratual-1));
  var devedor2 = Math.pow(ind,tmenosum);
  var cima2 = (devedor2-1);
  var baixo2 = (devedor2*i);
  var divido2 = (cima2/baixo2);
  var valorparcela = ValorParcela();
  var seila = parseFloat(valorparcela*(divido2)).toFixed(2);
  document.calcform.saldodevedort1.value = seila;
  return seila;
}
function jurosdeOrdemTPrice()
{
  var taxa = document.calcform.taxa.value;
  var i = (parseFloat(taxa)/100); 
  var seila = SaldoDevedorTmenosum();
  var jurost = (i*(seila)).toFixed(2);
  document.calcform.jurosordemt.value = jurost;
  var periodo = document.calcform.periodo.value;
  var t = parseFloat(parcelas);
  return t;
}
function primeiraAmortizacaoPrice()
{
  var capital = document.calcform.capital.value;
  var dinheiro = parseFloat(capital); 
  var taxa = document.calcform.taxa.value;
  var i = (parseFloat(taxa)/100); 
  var valorparcela = ValorParcela();
  var amortiza1 = (valorparcela-(i*dinheiro)).toFixed(2);
  document.calcform.primeiraamortizacao.value = amortiza1;  
  return amortiza1;
}
function valordaAmortizacaoemTPrice()
{
  var amortiza1 = PrimeiraAmortizacao();
  var periodo = document.calcform.periodo.value;
  var peratual = parseFloat(periodo);
  var taxa = document.calcform.taxa.value;
  var i = (parseFloat(taxa)/100); 
  var tempo = (peratual-1);
  var ind = (i+1);
  var base = Math.pow(ind,tempo);
  var amortizacao = (amortiza1*base).toFixed(2);
  document.calcform.amortizacaot.value = amortizacao;
}
function totalAmortizacaoPrice()
{
  var capital = document.calcform.capital.value;
  var dinheiro = parseFloat(capital);
  var saldodevedor = SaldoDevedorT();
  var amortizacaototal = (dinheiro-saldodevedor).toFixed(2);
  document.calcform.amortizacaott.value = amortizacaototal; 
  
}
function jurosAcumuladoPrice()
{
  var periodo = document.calcform.periodo.value;  
  var parcela = ValorParcela();
  var t = parseFloat(periodo);
  var fva = FVA();
  var fva1 = FVAT();
  var finall = parseFloat((t-fva));
  var finale = parseFloat((finall+fva1));
  
  var res = parseFloat((parcela*finale)).toFixed(2);  
  document.calcform.jurosacum.value = res;
  return res;
}


function amortizacaoEmTKPrice()
{
  
  var parcela = ValorParcela();
  var fvat = FVAT();
  var fvatk = FVATK();
  var meio = parseFloat((fvat-fvatk));
  var res = parseFloat((parcela*meio)).toFixed(2);  
  document.calcform.amortizacaott2.value = res;
  return res;
}

function jurosAcumuladoEmTKPrice()
{ 
  var parcela = ValorParcela();
  var k = K();
  var a = AmortizacaoEmTK();
  var res = parseFloat(((parcela*k)-a)).toFixed(2);
  document.calcform.jurosacum2.value = res;
  return res;
}

function calcularPrice() 
{
  AmortizacaoEmTK();
    JurosAcumuladoEmTK();
    ValorParcela();
    SaldoDevedorT();
    SaldoDevedorTmenosum();
    JurosdeOrdemT();
    PrimeiraAmortizacao();
    ValordaAmortizacaoemT()
    TotalAmortizacao();
    JurosAcumulado();
  

}   

/******SAC*******/

function valorKSac()
{
  var k = document.calcform.periodok.value;
  var t = document.calcform.periodo.value;
  var first = parseFloat(k);
  var tempo = parseFloat(t);
  var res = parseFloat((first-tempo));
  return res;
}

function valorAmortizacaoSac()
{
  var parcelas = document.calcform.parcelas.value;
  var taxa = document.calcform.taxa.value;
  var capital = document.calcform.capital.value;
  var periodo = document.calcform.periodo.value;
  
  var dinheiro = parseFloat(capital);
  var tempo = parseFloat(parcelas);
  var amortizacao = parseFloat((dinheiro/tempo)).toFixed(2);  
  document.calcform.valoramortizacao.value = amortizacao;
  return amortizacao;
}

function saldoDevedorTSac()
{
  var parcelas = document.calcform.parcelas.value;
  var periodo = document.calcform.periodo.value;
  var tempo = parseFloat(parcelas);
  var periodoatual = parseFloat(periodo);
  var amortizacao = ValorAmortizacao();
  
  var base = parseFloat((tempo-periodoatual));
  var res = parseFloat((amortizacao*base)).toFixed(2);
  document.calcform.saldodevedort.value = res;
  return res; 
}

function saldoDevedorTumSac()
{
  var parcelas = document.calcform.parcelas.value;
  var periodo = document.calcform.periodo.value;
  var tempo = parseFloat(parcelas);
  var periodoatual = parseFloat(periodo);
  var amortizacao = ValorAmortizacao();
  
  var base = parseFloat((periodoatual+1));
  var segundo = parseFloat((tempo-base));
  var res = parseFloat((amortizacao*segundo)).toFixed(2);
  document.calcform.saldodevedortum.value = res;
  return res; 
}

function valorDoJurosSac()
{
  var taxa = document.calcform.taxa.value;
  var i = parseFloat((taxa/100));
  var parcelas = SaldoDevedorTum();
  var res = parseFloat((i*parcelas)).toFixed(2);
  document.calcform.parcelajurosordemt.value = res;
  return res;
}

function valorPrestacaoOrdemTSac()
{
  var taxa = document.calcform.taxa.value;
  var parcelas = document.calcform.parcelas.value;
  var periodo = document.calcform.periodo.value;
  
  var tempo = parseFloat(parcelas);
  var periodoatual = parseFloat(periodo);
  var i = parseFloat((taxa/100));
  var amortizacao = ValorAmortizacao();
  
  
  var base = parseFloat(tempo-periodoatual);
  var base2 = parseFloat(base+1);
  var base3 = parseFloat(base2*i);
  var base4 = parseFloat(base3+1);
  var res = parseFloat((amortizacao*base4)).toFixed(2);
  document.calcform.prestacaoordemt.value = res;
  return res;   
}

function somaAmortizacoesTKSac()
{
  var periodok = document.calcform.periodok.value;
  var k = valorK();
  var parcela = ValorAmortizacao();
  var res = parseFloat((k*parcela)).toFixed(2);
  document.calcform.amortizacaotk.value = res;
  return res;
}

function jurosAcumuladoEmT()
{
  var taxa = document.calcform.taxa.value;
  var i = parseFloat((taxa/100)); 
  var periodo = document.calcform.periodo.value;    
  var t = parseFloat(periodo);
  var parcelas = document.calcform.parcelas.value;    
  var n = parseFloat(parcelas); 
  var meio = parseFloat(2*n);
  var meio2 = parseFloat(meio-t);
  var meio3 = parseFloat(meio2+1);
  var meio4 = parseFloat(meio3/2);
  var parcela = ValorAmortizacao();
  var fist = parseFloat(i*parcela);
  var fist2 = parseFloat(fist*t);
  
  var res = parseFloat((fist2*meio4)).toFixed(2);
  document.calcform.somajurost.value = res;
  return res; 
}

function jurosTKSac()
{
  var taxa = document.calcform.taxa.value;
  var i = parseFloat((taxa/100)); 
  var parcelas = document.calcform.parcelas.value;    
  var n = parseFloat((parcelas));
  var periodo = document.calcform.periodo.value;    
  var t = parseFloat((periodo));
  var a = ValorAmortizacao();
  var k = valorK();
  
  var comeco = parseFloat(((k-1)/2));
  var segundo = parseFloat(((n-t)-comeco));
  var terceiro = parseFloat((k*segundo));
  var res = parseFloat(((terceiro*a)*i)).toFixed(2);
  document.calcform.somajurostk.value = res;  
  
  return segundo;
}

function somaPrestacoesASac()
{
  var taxa = document.calcform.taxa.value;
  var i = parseFloat((taxa/100)); 
  var parcelas = document.calcform.parcelas.value;    
  var n = parseFloat((parcelas));
  var periodo = document.calcform.periodo.value;    
  var t = parseFloat((periodo));
  var a = ValorAmortizacao();

  var primeiro = parseFloat((2*n));
  var segundo = parseFloat((t+1));
  var terceiro = parseFloat((primeiro-segundo));
  var quarto = parseFloat((terceiro/2));
  var quinto = parseFloat((i*quarto));
  var sexto = parseFloat((quinto+1));
  var res = parseFloat(((sexto*t)*a)).toFixed(2);
  document.calcform.somaprestacaoa.value = res;
  
}

function somaPrestacoesTKSac()
{
  var tex = JurosTK();
  var tenta = parseFloat(tex);
  var taxa = document.calcform.taxa.value;
  var i = parseFloat((taxa/100)); 
  var parcelas = document.calcform.parcelas.value;    
  var n = parseFloat((parcelas));
  var periodo = document.calcform.periodo.value;    
  var t = parseFloat((periodo));
  var a = ValorAmortizacao(); 
  var k = valorK();
  
  var primeiro = parseFloat((tenta*i));
  var segundo = parseFloat((primeiro+1));
  var terceiro = parseFloat((k*segundo));
  var res = parseFloat((a*terceiro)).toFixed(2);
  document.calcform.somaprestacaotk.value = res;
  
  return res;
}

function decrescimoSac()
{
  var taxa = document.calcform.taxa.value;
  var i = parseFloat((taxa/100));   
  var a = ValorAmortizacao(); 
  
  var res = parseFloat((i*a)).toFixed(2);
  document.calcform.decrescimo.value = res;
  return res;
  
}

function calcularSac() 
{
    JurosTK();
    Decrescimo();
    SomaPrestacoesA();
    JurosAcumuladoEmT();
    SomaAmortizacoesTK();
    ValorAmortizacao();
    SaldoDevedorT();
    SaldoDevedorTum();
    ValorPrestacaoOrdemT();
    ValorDoJuros();
    SomaPrestacoesTK();
}   



/***********/
var digits = "0123456789";
var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz"
var uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
var whitespace = " tnr";
var decimalPointDelimiter = "."
 
 
var iDay = "O dia da data deve estar entre 1 e 31.  Por favor corrija."
var iMonth = "O mês da data deve estar 1 e 12.  Por favor corrija."
var icpfcgc = "O CPF/CNPJ é inválido. Por favor corrija."
var iYear = "O ano deve ter 2 ou 4 dígitos.  Por favor corrija."
var iDatePrefix = ""
var iDateSuffix = " não é uma data válida.  Por favor corrija."
var pEntryPrompt = "Por favor entre um "
var pDay = "número de dia entre 1 e 31."
var pMonth = "número de mês entre 1 e 12."
var pYear = "número de ano com 2 ou 4 dígitos."
var defaultEmptyOK = false
 
 
function makeArray(n) {
//*** BUG: If I put this line in, I get two error messages:
//(1) Window.length can't be set by assignment
//(2) daysInMonth has no property indexed by 4
//If I leave it out, the code works fine.
//   this.length = n;
   for (var i = 1; i <= n; i++) {
      this[i] = 0
   } 
   return this
}
 
 
 
var daysInMonth = makeArray(12);
daysInMonth[1] = 31;
daysInMonth[2] = 29;   // must programmatically check this
daysInMonth[3] = 31;
daysInMonth[4] = 30;
daysInMonth[5] = 31;
daysInMonth[6] = 30;
daysInMonth[7] = 31;
daysInMonth[8] = 31;
daysInMonth[9] = 30;
daysInMonth[10] = 31;
daysInMonth[11] = 30;
daysInMonth[12] = 31;
 
 
 
function isEmpty(s)
{   return ((s == null) || (s.length == 0))
}
 
 
function isWhitespace (s)
 
{   var i;
 
    // Is s empty?
    if (isEmpty(s)) return true;
 
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
 
        if (whitespace.indexOf(c) == -1) return false;
    }
 
    // All characters are whitespace.
    return true;
}
 
 
 
// Removes all characters which appear in string bag from string s.
 
function stripCharsInBag (s, bag)
 
{   var i;
    var returnString = "";
 
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
 
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
 
    return returnString;
}
 
function stripCharsNotInBag (s, bag)
 
{   var i;
    var returnString = "";
 
    // Search through string's characters one by one.
    // If character is in bag, append to returnString.
 
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) != -1) returnString += c;
    }
 
    return returnString;
}
 
 
function stripWhitespace (s)
 
{   return stripCharsInBag (s, whitespace)
}
 
 
function charInString (c, s)
{   for (i = 0; i < s.length; i++)
    {   if (s.charAt(i) == c) return true;
    }
    return false
}
 
 
function stripInitialWhitespace (s)
 
{   var i = 0;
 
    while ((i < s.length) && charInString (s.charAt(i), whitespace))
       i++;
    
    return s.substring (i, s.length);
}
 
function isLetter (c)
{   return ( ((c >= "a") && (c <= "z")) || ((c >= "A") && (c <= "Z")) )
}
 
function isDigit (c)
{   return ((c >= "0") && (c <= "9"))
}
 
function isLetterOrDigit (c)
{   return (isLetter(c) || isDigit(c))
}
 
function isInteger (s)
 
{   var i;
 
    if (isEmpty(s)) 
       if (isInteger.arguments.length == 1) return defaultEmptyOK;
       else return (isInteger.arguments[1] == true);
 
 
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is number.
        var c = s.charAt(i);
 
        if (!isDigit(c)) return false;
    }
 
    // All characters are numbers.
    return true;
}
 
 
function isSignedInteger (s)
 
{   if (isEmpty(s)) 
       if (isSignedInteger.arguments.length == 1) return defaultEmptyOK;
       else return (isSignedInteger.arguments[1] == true);
 
    else {
        var startPos = 0;
        var secondArg = defaultEmptyOK;
 
        if (isSignedInteger.arguments.length > 1)
            secondArg = isSignedInteger.arguments[1];
 
        // skip leading + or -
        if ( (s.charAt(0) == "-") || (s.charAt(0) == "+") )
           startPos = 1;    
        return (isInteger(s.substring(startPos, s.length), secondArg))
    }
}
 
function isPositiveInteger (s)
{   var secondArg = defaultEmptyOK;
 
    if (isPositiveInteger.arguments.length > 1)
        secondArg = isPositiveInteger.arguments[1];
 
 
    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s,10) > 0) ) );
}
 
function isNonnegativeInteger (s)
{   var secondArg = defaultEmptyOK;
 
    if (isNonnegativeInteger.arguments.length > 1)
        secondArg = isNonnegativeInteger.arguments[1];
 
    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s,10) >= 0) ) );
}
 
 
function isNegativeInteger (s)
{   var secondArg = defaultEmptyOK;
 
    if (isNegativeInteger.arguments.length > 1)
        secondArg = isNegativeInteger.arguments[1];
 
    // The next line is a bit byzantine.  What it means is:
    // a) s must be a signed integer, AND
    // b) one of the following must be true:
    //    i)  s is empty and we are supposed to return true for
    //        empty strings
    //    ii) this is a negative, not positive, number
 
    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s,10) < 0) ) );
}
 
 
function isNonpositiveInteger (s)
{   var secondArg = defaultEmptyOK;
 
    if (isNonpositiveInteger.arguments.length > 1)
        secondArg = isNonpositiveInteger.arguments[1];
 
    // The next line is a bit byzantine.  What it means is:
    // a) s must be a signed integer, AND
    // b) one of the following must be true:
    //    i)  s is empty and we are supposed to return true for
    //        empty strings
    //    ii) this is a number <= 0
 
    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s,10) <= 0) ) );
}
 
 
function isFloat (s)
 
{   var i;
    var seenDecimalPoint = false;
 
    if (isEmpty(s)) 
       if (isFloat.arguments.length == 1) return defaultEmptyOK;
       else return (isFloat.arguments[1] == true);
 
    if (s == decimalPointDelimiter) return false;
 
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is number.
        var c = s.charAt(i);
 
        if ((c == decimalPointDelimiter) && !seenDecimalPoint) seenDecimalPoint = true;
        else if (!isDigit(c)) return false;
    }
 
    // All characters are numbers.
    return true;
}
 
 
function isSignedFloat (s)
 
{   if (isEmpty(s)) 
       if (isSignedFloat.arguments.length == 1) return defaultEmptyOK;
       else return (isSignedFloat.arguments[1] == true);
 
    else {
        var startPos = 0;
        var secondArg = defaultEmptyOK;
 
        if (isSignedFloat.arguments.length > 1)
            secondArg = isSignedFloat.arguments[1];
 
        // skip leading + or -
        if ( (s.charAt(0) == "-") || (s.charAt(0) == "+") )
           startPos = 1;    
        return (isFloat(s.substring(startPos, s.length), secondArg))
    }
}
 
function isAlphabetic (s)
 
{   var i;
 
    if (isEmpty(s)) 
       if (isAlphabetic.arguments.length == 1) return defaultEmptyOK;
       else return (isAlphabetic.arguments[1] == true);
 
    // Search through string's characters one by one
    // until we find a non-alphabetic character.
    // When we do, return false; if we don't, return true.
 
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is letter.
        var c = s.charAt(i);
 
        if (!isLetter(c))
        return false;
    }
 
    // All characters are letters.
    return true;
}
 
 
function isAlphanumeric (s)
 
{   var i;
 
    if (isEmpty(s)) 
       if (isAlphanumeric.arguments.length == 1) return defaultEmptyOK;
       else return (isAlphanumeric.arguments[1] == true);
 
    // Search through string's characters one by one
    // until we find a non-alphanumeric character.
    // When we do, return false; if we don't, return true.
 
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is number or letter.
        var c = s.charAt(i);
 
        if (! (isLetter(c) || isDigit(c) ) )
        return false;
    }
 
    // All characters are numbers or letters.
    return true;
}
 
 
 
function reformat (s)
 
{   var arg;
    var sPos = 0;
    var resultString = "";
 
    for (var i = 1; i < reformat.arguments.length; i++) {
       arg = reformat.arguments[i];
       if (i % 2 == 1) resultString += arg;
       else {
           resultString += s.substring(sPos, sPos + arg);
           sPos += arg;
       }
    }
    return resultString;
}
 
function isIntegerInRange (s, a, b)
{   if (isEmpty(s)) 
       if (isIntegerInRange.arguments.length == 1) return defaultEmptyOK;
       else return (isIntegerInRange.arguments[1] == true);
 
    // Catch non-integer strings to avoid creating a NaN below,
    // which isn't available on JavaScript 1.0 for Windows.
    if (!isInteger(s, false)) return false;
 
    // Now, explicitly change the type to integer via parseInt
    // so that the comparison code below will work both on 
    // JavaScript 1.2 (which typechecks in equality comparisons)
    // and JavaScript 1.1 and before (which doesn't).
    var num = parseInt (s,10);
    return ((num >= a) && (num <= b));
}
 
function CompletaString(s,i)
{
    var t,u
    u = new String()
    
    u = s
    
    if (u.length > i)
    {
        
        t = u.substring(0,i)
    }
    else
    {
        t = u   
        for (j=u.length;j<i;j++)
        {
          t = t + " "   
        }
    }
    return t
}
 
function CompletaNumero2(s,i)
{
    var t,u
    u = new String(s)
    
    
    t = ""
    
    
    if (u.length > i)
    {
        
        t = u.substring(0,i)
    }
    else
    {
        t = u   
        for (j=u.length;j<i;j++)
        {
          t = "0" + t   
        }
    }
    
    return t
}
    
 
 
 
 
function checkRadio(r)
{
    for (var i=0; i < r.length; i++)
    {
        if (r[i].checked)
        {
            return true
        }
    }
    return false
}
 
function RadioValue(r)
{
    for (var i=0; i < r.length; i++)
    {
        if (r[i].checked)
        {
            return r[i].value
        }
    }
    return ""
}
 
function checkInput(i)
 
{
    
    if (i.value == "" || isWhitespace(i.value))
    {
        
        return false
    }
    else
    {
        return true
    }
    
    
}
 
  function Limpar()
  {
   document.form1.periodo.value = ""
   document.form1.juros.value = ""
   document.form1.parcela.value = ""
   document.form1.montante.value = ""
  }
 
 
 
  function Calcular(opcao)
  {
  var s
  if (!checkInput(document.form1.periodo)) {
        if (!checkInput(document.form1.juros) ||
            !checkInput(document.form1.parcela) ||
            !checkInput(document.form1.montante)) {
            alert("Preencha 3 valores para calcular o 4º.")
            return
        }
            opcao = 1
  } else
    if (!checkInput(document.form1.juros)) {
        if (!checkInput(document.form1.periodo) ||
            !checkInput(document.form1.parcela) ||
            !checkInput(document.form1.montante)) {
            alert("Preencha 3 valores para calcular o 4º.")
            return
        }
        opcao = 2
     } else
       if (!checkInput(document.form1.parcela)) {
              if (!checkInput(document.form1.periodo) ||
                  !checkInput(document.form1.juros) ||
                  !checkInput(document.form1.montante)) {
                  alert("Preencha 3 valores para calcular o 4º.")
                  return
              }
          opcao = 3
       } else
         if (!checkInput(document.form1.montante)) {
                if (!checkInput(document.form1.juros) ||
                    !checkInput(document.form1.parcela) ||
                    !checkInput(document.form1.periodo)) {
                    alert("Preencha 3 valores para calcular o 4º.")
                    return
                }
            opcao = 4
         } else {
                  alert("Preencha apenas 3 valores para calcular o 4º.")
                  return
           }
 
  if (opcao != 1) {
      s = document.form1.periodo.value
      s = s.replace(",", ".")
      if(!isFloat(s))
      {
        alert("Período deve ser um valor inteiro.")
        return
      }
 
      per_int = parseFloat(s)
  }
 
  if (opcao != 2) {
 
      s = document.form1.juros.value
      s = s.replace(",", ".")
 
        if(!isFloat(s))
        {
          alert("Taxa de Juros deve ser um valor númerico, tendo a vírgula(,) como delimitador da parte fracionária.")
          return
        }
 
        juros_float = parseFloat(s)/100
 
 
  }
 
  if (opcao != 3) {
      s = document.form1.parcela.value
      s = s.replace(",", ".")
          if(!isFloat(s))
          {
                alert("Valor da prestação deve ser um valor númerico, tendo a vírgula(,) como delimitador dos centavos.")
                return
          }
 
          parcela_float = parseFloat(s)
 
 
  }
 
  if (opcao != 4) {
      s = document.form1.montante.value
      s = s.replace(",", ".")
 
          if(!isFloat(s))
          {
                alert("Valor do Financiamento deve ser um valor númerico maior que zero, tendo a vírgula(,) como delimitador dos centavos.")
                return
          }
 
          montante_float = parseFloat(s)
 
 
  }
 
  if (opcao==1) {
 
    per_int = Math.log(1-(montante_float*juros_float/parcela_float))/Math.log(1/(1+juros_float))
    per_int = Math.round(per_int*100)/100
 
    var s = String(per_int)
    i = s.indexOf(".")
        if (i != -1)
        {
                s = s.substring(0,i) + "," + s.substring(i+1,s.length)
 
        }
    document.form1.periodo.value = s
  }
 
    if (opcao==2) {
        juros_inicial = parseFloat("-1")
        juros_final = parseFloat("99999")
        suposto_juros = parseFloat("0")
        suposto_parcela = parseFloat("0")
        var cont = 1
        var achou = false
        while (true) {
            suposto_juros = (juros_final + juros_inicial)/2
            suposto_parcela = (montante_float*suposto_juros)/(1-Math.pow(1/(1+suposto_juros),per_int))
            suposta_diferenca = Math.abs(parcela_float-suposto_parcela)
            if (suposta_diferenca > 0.000000001) {
                if (suposto_parcela > parcela_float) {
                    juros_final = suposto_juros
                }
                else {
                    juros_inicial = suposto_juros
                }
            }
            else {
                achou = true
                break
            }
            if (cont > 5000) {
                break
            }
            cont++
        }
        if (achou==false) {
            document.form1.juros.value = "NaN"
        }
        else {
            if (suposto_juros!=-100) {
                suposto_juros = suposto_juros*100
            }
            juros_float = Math.round(suposto_juros*100000)/100000
            var s = String(juros_float)
            i = s.indexOf(".")
            if (i != -1) {
                s = s.substring(0,i) + "," + s.substring(i+1,s.length)
            }
            document.form1.juros.value = s
            return
        }
    }
 
    if (opcao==3) {
        parcela_float = (montante_float*juros_float)/(1 - Math.pow(1/(1+juros_float),per_int))
        parcela_float = Math.round(parcela_float*100)/100
        var s = String(parcela_float)
        i = s.indexOf(".")
        if (i != -1) {
            s = s.substring(0,i) + "," + s.substring(i+1,s.length)
        }
        document.form1.parcela.value = s
        return
    }
 
    if (opcao==4) {
        montante_float = (parcela_float*(1 - Math.pow(1/(1+juros_float),per_int))/juros_float)
        montante_float = Math.round(montante_float*100)/100
        var s = String(montante_float)
        i = s.indexOf(".")
        if (i != -1) {
            s = s.substring(0,i) + "," + s.substring(i+1,s.length)
        }
        document.form1.montante.value = s
        return
    }
}
 

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
