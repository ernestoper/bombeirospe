import { useState, useRef } from 'react';
import Card from '../components/common/Card';
import { mockOccurrences } from '../data/mockOccurrences';
import { EnhancedReport } from '../components/reports/EnhancedReport';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Página de relatórios aprimorada com insights analíticos
 * Acessível para usuários com permissão de operador ou superior
 */
function ReportsPage() {
  const [reportType, setReportType] = useState('occurrence');
  const [dateRange, setDateRange] = useState('last30days');
  const [filterArea, setFilterArea] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const advancedReportRef = useRef(null);
  
  // Mock de áreas de atuação
  const areas = [
    { id: 'all', name: 'Todas as áreas' },
    { id: 'norte', name: 'Zona Norte' },
    { id: 'sul', name: 'Zona Sul' },
    { id: 'leste', name: 'Zona Leste' },
    { id: 'oeste', name: 'Zona Oeste' },
    { id: 'centro', name: 'Centro' }
  ];
  
  // Mock de tipos de relatórios
  const reportTypes = [
    { id: 'occurrence', name: 'Relatório de Ocorrências', icon: '🔥', color: 'from-red-500 to-red-700' },
    { id: 'performance', name: 'Relatório de Desempenho', icon: '📊', color: 'from-blue-500 to-blue-700' },
    { id: 'resources', name: 'Utilização de Recursos', icon: '🚒', color: 'from-purple-500 to-purple-700' },
    { id: 'time', name: 'Tempos de Resposta', icon: '⏱️', color: 'from-green-500 to-green-700' },
    { id: 'casualties', name: 'Relatório de Vítimas', icon: '🚑', color: 'from-orange-500 to-orange-700' }
  ];
  
  // Mock de períodos
  const dateRanges = [
    { id: 'last7days', name: 'Últimos 7 dias' },
    { id: 'last30days', name: 'Últimos 30 dias' },
    { id: 'last90days', name: 'Últimos 90 dias' },
    { id: 'thisyear', name: 'Este ano' },
    { id: 'custom', name: 'Período personalizado' }
  ];
  
  // Função para gerar relatório
  const generateReport = () => {
    setIsGenerating(true);
    toast.loading('Gerando relatório...');
    
    // Simulando tempo de geração
    setTimeout(() => {
      setIsGenerating(false);
      toast.dismiss();
      toast.success('Relatório gerado com sucesso!');
      setGeneratedReport({
        type: reportType,
        dateRange: dateRange,
        area: filterArea,
        generatedAt: new Date().toISOString(),
        data: {
          summary: {
            totalOccurrences: 45,
            avgResponseTime: '9.5 min',
            casualties: 12,
            resourcesUsed: '85%'
          },
          details: [
            // Detalhes do relatório seriam injetados aqui
          ]
        }
      });
    }, 1500);
  };

  // Função para exportar relatório padrão como PDF
  const exportToPDF = () => {
    if (!generatedReport) return;
    
    toast.loading('Gerando PDF padrão...');
    
    const report = generatedReport;
    const reportTitle = reportTypes.find(type => type.id === report.type)?.name || 'Relatório';
    const areaName = areas.find(area => area.id === report.area)?.name || 'Todas as áreas';
    const dateRangeName = dateRanges.find(range => range.id === report.dateRange)?.name || 'Período personalizado';
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      let yPos = 20;
      
      // Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('CORPO DE BOMBEIROS MILITAR DE PERNAMBUCO', 105, yPos, { align: 'center' });
      
      yPos += 10;
      doc.setFontSize(14);
      doc.text(`${reportTitle} - VERSAO PADRAO`, 105, yPos, { align: 'center' });
      
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(areaName, 105, yPos, { align: 'center' });
      
      yPos += 15;
      doc.setFontSize(9);
      doc.text(`Gerado em: ${new Date(report.generatedAt).toLocaleString('pt-BR')}`, 20, yPos);
      doc.text(`Periodo: ${dateRangeName}`, 120, yPos);
      
      // Linha separadora
      yPos += 5;
      doc.line(20, yPos, 190, yPos);
      
      // Resumo Executivo
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMO EXECUTIVO', 20, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de Ocorrencias: ${report.data.summary.totalOccurrences}`, 20, yPos);
      
      yPos += 6;
      doc.text(`Tempo Medio de Resposta: ${report.data.summary.avgResponseTime}`, 20, yPos);
      
      yPos += 6;
      doc.text(`Vitimas: ${report.data.summary.casualties}`, 20, yPos);
      
      yPos += 6;
      doc.text(`Utilizacao de Recursos: ${report.data.summary.resourcesUsed}`, 20, yPos);
      
      // Linha separadora
      yPos += 8;
      doc.line(20, yPos, 190, yPos);
      
      // Detalhes das Ocorrências
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DETALHES DAS OCORRENCIAS', 20, yPos);
      
      yPos += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      mockOccurrences.slice(0, 5).forEach((occ, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${idx + 1}. ID: #${occ.id}`, 20, yPos);
        yPos += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.text(`   Tipo: ${occ.tipo}`, 20, yPos);
        yPos += 5;
        
        doc.text(`   Data/Hora: ${new Date(occ.dataHora).toLocaleString('pt-BR')}`, 20, yPos);
        yPos += 5;
        
        const endereco = occ.endereco.length > 70 ? occ.endereco.substring(0, 70) + '...' : occ.endereco;
        doc.text(`   Localizacao: ${endereco}`, 20, yPos);
        yPos += 5;
        
        doc.text(`   Status: ${occ.status}`, 20, yPos);
        yPos += 5;
        
        doc.text(`   Tempo de Resposta: ${occ.tempoResposta}`, 20, yPos);
        yPos += 5;
        
        if (occ.vitimas > 0) {
          doc.text(`   Vitimas: ${occ.vitimas}`, 20, yPos);
          yPos += 5;
        }
        
        yPos += 3;
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Relatorio gerado automaticamente pelo Sistema de Gestao CBMPE', 105, 285, { align: 'center' });
        doc.text(`Pagina ${i} de ${pageCount}`, 105, 290, { align: 'center' });
      }
      
      // Salvar PDF
      doc.save(`relatorio_padrao_${report.type}_${new Date().getTime()}.pdf`);
      
      setTimeout(() => {
        toast.dismiss();
        toast.success('PDF padrão exportado com sucesso!');
      }, 500);
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao gerar PDF: ' + error.message);
    }
  };

  // Função para exportar relatório avançado como PDF com gráficos
  const exportAdvancedToPDF = async () => {
    if (!generatedReport || !advancedReportRef.current) {
      toast.error('Gere um relatório primeiro!');
      return;
    }
    
    const toastId = toast.loading('Preparando captura de gráficos...');
    
    const report = generatedReport;
    const reportTitle = reportTypes.find(type => type.id === report.type)?.name || 'Relatório';
    const areaName = areas.find(area => area.id === report.area)?.name || 'Todas as áreas';
    const dateRangeName = dateRanges.find(range => range.id === report.dateRange)?.name || 'Período personalizado';
    
    try {
      const doc = new jsPDF();
      let yPos = 20;
      
      // Header com destaque
      doc.setFillColor(200, 16, 46); // Vermelho CBMPE
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('CORPO DE BOMBEIROS MILITAR DE PERNAMBUCO', 105, 12, { align: 'center' });
      
      doc.setFontSize(13);
      doc.text(`${reportTitle} - VERSAO AVANCADA COM INSIGHTS`, 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(areaName, 105, 26, { align: 'center' });
      
      // Voltar para texto preto
      doc.setTextColor(0, 0, 0);
      yPos = 40;
      
      doc.setFontSize(9);
      doc.text(`Gerado em: ${new Date(report.generatedAt).toLocaleString('pt-BR')}`, 20, yPos);
      doc.text(`Periodo: ${dateRangeName}`, 120, yPos);
      
      // Resumo Executivo
      yPos += 10;
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 5, 180, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMO EXECUTIVO', 20, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de Ocorrencias: ${report.data.summary.totalOccurrences}`, 20, yPos);
      doc.text(`Tempo Medio: ${report.data.summary.avgResponseTime}`, 110, yPos);
      
      yPos += 6;
      doc.text(`Vitimas: ${report.data.summary.casualties}`, 20, yPos);
      doc.text(`Recursos: ${report.data.summary.resourcesUsed}`, 110, yPos);
      
      // Insights Analíticos
      yPos += 12;
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 5, 180, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INSIGHTS ANALITICOS AVANCADOS', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('ANALISE DE TENDENCIAS', 20, yPos);
      
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('- Aumento de 15% nas ocorrencias em relacao ao periodo anterior', 25, yPos);
      yPos += 5;
      doc.text('- Pico de ocorrencias identificado entre 14h-18h', 25, yPos);
      yPos += 5;
      doc.text('- Maior concentracao de ocorrencias na Zona Norte (35%)', 25, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('INDICADORES DE DESEMPENHO', 20, yPos);
      
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('- Taxa de resposta dentro do tempo ideal: 87%', 25, yPos);
      yPos += 5;
      doc.text('- Eficiencia operacional: Alta', 25, yPos);
      yPos += 5;
      doc.text('- Satisfacao estimada: 92%', 25, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('PONTOS DE ATENCAO', 20, yPos);
      
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('- Necessidade de reforco de equipes no periodo vespertino', 25, yPos);
      yPos += 5;
      doc.text('- Manutencao preventiva de equipamentos recomendada', 25, yPos);
      yPos += 5;
      doc.text('- Treinamento adicional sugerido para novos tipos de ocorrencia', 25, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('RECOMENDACOES ESTRATEGICAS', 20, yPos);
      
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('1. Redistribuir equipes para otimizar cobertura geografica', 25, yPos);
      yPos += 5;
      doc.text('2. Implementar sistema de alerta precoce nas areas criticas', 25, yPos);
      yPos += 5;
      doc.text('3. Aumentar estoque de recursos na Zona Norte', 25, yPos);
      yPos += 5;
      doc.text('4. Realizar simulados mensais de situacoes complexas', 25, yPos);
      
      // Capturar gráficos do relatório avançado
      doc.addPage();
      yPos = 20;
      
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 5, 180, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('GRAFICOS E VISUALIZACOES', 20, yPos);
      
      yPos += 10;
      
      // Capturar todos os gráficos do componente EnhancedReport
      const reportElement = advancedReportRef.current;
      if (reportElement) {
        try {
          // Rolar para o topo para garantir que todos os elementos estejam visíveis
          window.scrollTo(0, 0);
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Encontrar todos os containers de gráficos
          const allContainers = reportElement.querySelectorAll('.bg-white.p-4.rounded-lg.shadow, .bg-white.rounded-lg.shadow');
          
          let capturedCount = 0;
          const charts = [];
          
          // Primeiro, identificar todos os containers com gráficos
          for (let i = 0; i < allContainers.length; i++) {
            const container = allContainers[i];
            const hasChart = container.querySelector('.recharts-wrapper, .recharts-surface');
            
            if (hasChart) {
              charts.push(container);
            }
          }
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.text(`Capturando ${charts.length} graficos...`, 20, yPos);
          yPos += 10;
          
          // Agora capturar cada gráfico
          for (let i = 0; i < charts.length; i++) {
            const container = charts[i];
            
            // Rolar até o elemento para garantir que está visível
            container.scrollIntoView({ behavior: 'instant', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            try {
              // Capturar o container inteiro (incluindo título e gráfico)
              const canvas = await html2canvas(container, {
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                windowWidth: container.scrollWidth,
                windowHeight: container.scrollHeight,
                onclone: (clonedDoc) => {
                  // Garantir que o elemento clonado está visível
                  const clonedElement = clonedDoc.querySelector('.recharts-wrapper');
                  if (clonedElement) {
                    clonedElement.style.opacity = '1';
                  }
                }
              });
              
              const imgData = canvas.toDataURL('image/png');
              const imgWidth = 170;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              // Limitar altura máxima
              const maxHeight = 110;
              const finalHeight = Math.min(imgHeight, maxHeight);
              const finalWidth = finalHeight === maxHeight ? (canvas.width * maxHeight) / canvas.height : imgWidth;
              
              // Verificar se precisa de nova página
              if (yPos + finalHeight > 250) {
                doc.addPage();
                yPos = 20;
              }
              
              doc.addImage(imgData, 'PNG', 20, yPos, finalWidth, finalHeight);
              yPos += finalHeight + 5;
              capturedCount++;
              
            } catch (chartError) {
              console.error(`Erro ao capturar gráfico ${i + 1}:`, chartError);
              // Continuar com o próximo gráfico
            }
          }
          
          if (capturedCount === 0) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            doc.text('Nenhum grafico foi capturado. Aguarde o carregamento completo.', 20, yPos);
            yPos += 10;
          } else {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Total de ${capturedCount} graficos capturados com sucesso`, 20, yPos);
            yPos += 10;
          }
        } catch (error) {
          console.error('Erro ao capturar gráficos:', error);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.text('Nota: Alguns graficos nao puderam ser capturados', 20, yPos);
          doc.text(`Erro: ${error.message}`, 20, yPos + 5);
          yPos += 15;
        }
      } else {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text('Acesse a visao avancada antes de exportar para incluir graficos', 20, yPos);
        yPos += 10;
      }
      
      // Nova página para detalhes das ocorrências
      doc.addPage();
      yPos = 20;
      
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 5, 180, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DETALHES DAS OCORRENCIAS', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      mockOccurrences.slice(0, 10).forEach((occ, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text(`OCORRENCIA #${idx + 1} - ID: #${occ.id}`, 20, yPos);
        yPos += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.text(`Tipo: ${occ.tipo}`, 25, yPos);
        yPos += 4;
        doc.text(`Data/Hora: ${new Date(occ.dataHora).toLocaleString('pt-BR')}`, 25, yPos);
        yPos += 4;
        
        const endereco = occ.endereco.length > 65 ? occ.endereco.substring(0, 65) + '...' : occ.endereco;
        doc.text(`Localizacao: ${endereco}`, 25, yPos);
        yPos += 4;
        doc.text(`Coordenadas: ${occ.latitude}, ${occ.longitude}`, 25, yPos);
        yPos += 4;
        doc.text(`Status: ${occ.status} | Tempo: ${occ.tempoResposta}`, 25, yPos);
        yPos += 4;
        doc.text(`Vitimas: ${occ.vitimas > 0 ? occ.vitimas : 'Sem vitimas'}`, 25, yPos);
        yPos += 7;
      });
      
      // Estatísticas
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      yPos += 5;
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 5, 180, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('ESTATISTICAS DETALHADAS', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      doc.text('DISTRIBUICAO POR TIPO:', 20, yPos);
      
      yPos += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      Array.from(new Set(mockOccurrences.map(o => o.tipo))).forEach(tipo => {
        const count = mockOccurrences.filter(o => o.tipo === tipo).length;
        const percentage = ((count / mockOccurrences.length) * 100).toFixed(1);
        doc.text(`- ${tipo}: ${count} (${percentage}%)`, 25, yPos);
        yPos += 5;
      });
      
      yPos += 3;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('DISTRIBUICAO POR STATUS:', 20, yPos);
      
      yPos += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      Array.from(new Set(mockOccurrences.map(o => o.status))).forEach(status => {
        const count = mockOccurrences.filter(o => o.status === status).length;
        const percentage = ((count / mockOccurrences.length) * 100).toFixed(1);
        doc.text(`- ${status}: ${count} (${percentage}%)`, 25, yPos);
        yPos += 5;
      });
      
      yPos += 3;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('ANALISE TEMPORAL:', 20, yPos);
      
      yPos += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`- Media de ocorrencias por dia: ${(mockOccurrences.length / 30).toFixed(1)}`, 25, yPos);
      yPos += 5;
      doc.text('- Dia com mais ocorrencias: Sabado', 25, yPos);
      yPos += 5;
      doc.text('- Horario de pico: 15h-17h', 25, yPos);
      
      // Footer em todas as páginas
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text('Relatorio Avancado gerado automaticamente pelo Sistema de Gestao CBMPE com IA', 105, 285, { align: 'center' });
        doc.text('Documento confidencial - Uso interno do CBMPE', 105, 289, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.text(`Pagina ${i} de ${pageCount}`, 105, 293, { align: 'center' });
      }
      
      // Salvar PDF
      toast.loading('Finalizando PDF...', { id: toastId });
      doc.save(`relatorio_avancado_${report.type}_${new Date().getTime()}.pdf`);
      
      setTimeout(() => {
        toast.success('PDF avançado exportado com sucesso!', { id: toastId });
      }, 500);
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error('Erro ao gerar PDF: ' + error.message, { id: toastId });
    }
  };
  
  // Função para renderizar o relatório padrão gerado
  const renderStandardReport = () => {
    if (!generatedReport) return null;
    
    const report = generatedReport;
    const reportTitle = reportTypes.find(type => type.id === report.type)?.name || 'Relatório';
    const areaName = areas.find(area => area.id === report.area)?.name || 'Todas as áreas';
    const dateRangeName = dateRanges.find(range => range.id === report.dateRange)?.name || 'Período personalizado';
    
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 animate-fadeIn">
        {/* Header do Relatório */}
        <div className="mb-6 pb-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">{reportTypes.find(t => t.id === report.type)?.icon || '📄'}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{reportTitle}</h3>
              <p className="text-sm text-gray-500">{areaName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-xs text-gray-500 font-medium">Gerado em</p>
                <p className="text-sm font-semibold text-gray-800">{new Date(report.generatedAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
              <span className="text-lg">⏰</span>
              <div>
                <p className="text-xs text-gray-500 font-medium">Período</p>
                <p className="text-sm font-semibold text-gray-800">{dateRangeName}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                setShowAdvancedView(true);
                toast.info('Carregando insights avançados...');
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium flex items-center gap-2"
            >
              <span>🔬</span>
              Ver Insights Avançados
            </button>
            <button 
              onClick={exportToPDF}
              className="px-4 py-2 bg-gradient-to-r from-primary to-red-700 text-white text-sm rounded-xl hover:from-red-700 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium flex items-center gap-2"
            >
              <span>📥</span>
              Exportar PDF
            </button>
          </div>
        </div>
        
        {/* Resumo do relatório */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔥</span>
              <p className="text-xs text-gray-600 font-semibold">Total de Ocorrências</p>
            </div>
            <p className="text-3xl font-bold text-primary">{report.data.summary.totalOccurrences}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⏱️</span>
              <p className="text-xs text-gray-600 font-semibold">Tempo Médio de Resposta</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{report.data.summary.avgResponseTime}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🚑</span>
              <p className="text-xs text-gray-600 font-semibold">Vítimas</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">{report.data.summary.casualties}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🚒</span>
              <p className="text-xs text-gray-600 font-semibold">Utilização de Recursos</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">{report.data.summary.resourcesUsed}</p>
          </div>
        </div>
        
        {/* Nota sobre insights avançados */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border-2 border-purple-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-1">Quer ver mais detalhes?</h4>
              <p className="text-xs text-gray-600">
                Clique em <span className="font-semibold text-purple-700">"Ver Insights Avançados"</span> para acessar gráficos interativos, 
                análises detalhadas e visualizações avançadas com inteligência artificial.
              </p>
            </div>
          </div>
        </div>

        {/* Tabela de detalhes - comum para todos os relatórios */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📋</span>
            <h3 className="text-lg font-bold text-gray-800">Detalhes das Ocorrências</h3>
          </div>
          <div className="overflow-x-auto bg-white rounded-xl border-2 border-gray-200 shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tempo Resposta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockOccurrences.slice(0, 5).map((occurrence, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      #{occurrence.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {occurrence.tipo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(occurrence.dataHora).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {occurrence.endereco}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold border-2 ${
                        occurrence.status === 'Em Andamento' ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
                        occurrence.status === 'Controlado' ? 'bg-red-50 text-primary border-red-200' :
                        occurrence.status === 'Finalizado' ? 'bg-green-50 text-green-700 border-green-300' : ''
                      }`}>
                        {occurrence.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {occurrence.tempoResposta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  // Função para renderizar a visão avançada de insights
  const renderAdvancedReport = () => {
    if (!generatedReport) return null;
    
    return (
      <div className="mt-6 animate-fadeIn">
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border-2 border-purple-200 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔬</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Insights Avançados</h2>
                <p className="text-sm text-gray-600">Análise detalhada com inteligência artificial</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowAdvancedView(false);
                toast.info('Voltando para visão padrão');
              }}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm rounded-xl hover:from-gray-700 hover:to-gray-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium flex items-center gap-2"
            >
              <span>⬅️</span>
              Voltar para Visão Padrão
            </button>
          </div>
          
          {/* Botão de exportar PDF na visão avançada */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-white px-3 py-2 rounded-lg border border-purple-200">
                <span className="text-base">📊</span>
                <span className="font-medium">O PDF incluirá todos os gráficos e visualizações abaixo</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                <span className="text-base">⚠️</span>
                <span className="font-medium">Aguarde os gráficos carregarem completamente antes de exportar</span>
              </div>
            </div>
            <button 
              onClick={exportAdvancedToPDF}
              className="px-4 py-2 bg-gradient-to-r from-primary to-red-700 text-white text-sm rounded-xl hover:from-red-700 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <span>📥</span>
              Exportar PDF com Gráficos
            </button>
          </div>
        </div>
        
        {/* Componente de relatório avançado */}
        <div ref={advancedReportRef}>
          <EnhancedReport 
            reportType={reportType}
            occurrences={mockOccurrences}
            dateRange={dateRange}
            area={filterArea}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📊 Relatórios</h2>
          <p className="text-sm text-gray-500 mt-1">Gere relatórios detalhados e insights analíticos</p>
        </div>
      </div>

      {/* Formulário de geração de relatório */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📝</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Configurar Relatório</h3>
            <p className="text-xs text-gray-500">Selecione os parâmetros para gerar seu relatório</p>
          </div>
        </div>

        {/* Seleção visual de tipo de relatório */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-base">📋</span>
            Tipo de Relatório
          </label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  reportType === type.id
                    ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg scale-105`
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 shadow-sm'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-xs font-medium">{type.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-base">📅</span>
              Período
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white hover:border-gray-300 transition-all duration-300"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-base">📍</span>
              Área
            </label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white hover:border-gray-300 transition-all duration-300"
            >
              {areas.map((area) => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {dateRange === 'custom' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-base">📆</span>
                Data Inicial
              </label>
              <input
                type="date"
                className="w-full rounded-xl border-2 border-gray-200 shadow-sm p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-base">📆</span>
                Data Final
              </label>
              <input
                type="date"
                className="w-full rounded-xl border-2 border-gray-200 shadow-sm p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              />
            </div>
          </div>
        )}
        
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-xl">💡</span>
            <span className="font-medium">Os relatórios incluem insights analíticos avançados</span>
          </div>
          
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-primary to-red-700 text-white rounded-xl shadow-lg hover:from-red-700 hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all duration-300 transform hover:scale-105 font-medium"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando Relatório...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                Gerar Relatório
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Renderiza o relatório padrão ou avançado dependendo do estado */}
      {generatedReport && (
        showAdvancedView ? renderAdvancedReport() : renderStandardReport()
      )}
    </div>
  );
}

export default ReportsPage;