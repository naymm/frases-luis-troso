import React, { useState, useEffect } from 'react';
import { PenTool, Calendar, Save, BookOpen, Trash2, Loader2, Sun, Moon } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useTheme } from './lib/theme';

interface Thought {
  id: number;
  frase: string;
  total_caracteres?: number;
  created_at: string;
}

function App() {
  const [currentThought, setCurrentThought] = useState('');
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [activeView, setActiveView] = useState<'write' | 'history'>('write');
  const [savedMessage, setSavedMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingThoughts, setLoadingThoughts] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Carregar pensamentos do banco de dados
  useEffect(() => {
    loadThoughts();
  }, []);

  const loadThoughts = async () => {
    try {
      setLoadingThoughts(true);
      
      // Verificar se o Supabase está configurado
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Supabase não configurado - usando dados de exemplo');
        // Dados de exemplo para demonstração
        setThoughts([
          {
            id: 1,
            frase: "Este é um exemplo de pensamento. Configure as variáveis de ambiente do Supabase para usar dados reais.",
            created_at: new Date().toISOString()
          }
        ]);
        return;
      }
      
      const { data, error } = await supabase
        .from('frases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao carregar pensamentos:', error);
        return;
      }

      setThoughts(data || []);
    } catch (error) {
      console.error('Erro ao carregar pensamentos:', error);
    } finally {
      setLoadingThoughts(false);
    }
  };

  // Salvar pensamento no banco de dados
  const saveThought = async () => {
    if (!currentThought.trim()) return;

    try {
      setLoading(true);
      
      // Verificar se o Supabase está configurado
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Supabase não configurado - simulando salvamento');
        // Simular salvamento para demonstração
        const mockData = {
          id: Date.now(),
          frase: currentThought.trim(),
          created_at: new Date().toISOString()
        };
        
        setThoughts(prev => [mockData, ...prev]);
        setCurrentThought('');
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 2000);
        return;
      }
      
      // Calcular total de caracteres
      const totalCaracteres = currentThought.trim().length;
      
      const { data, error } = await supabase
        .from('frases')
        .insert([
          {
            frase: currentThought.trim(),
            estado: 'ativo',
            total_caracteres: totalCaracteres
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar pensamento:', error);
        return;
      }

      // Enviar frase para o webhook
      try {
        console.log('Enviando para webhook...');
        const webhookUrl = '/api/webhook/2m53qub077839bgy8g6iboa7v64xhp2g';
        const webhookData = {
          frase: currentThought.trim(),
          total_caracteres: totalCaracteres,
          timestamp: new Date().toISOString(),
          id: data.id
        };
        
        console.log('Dados do webhook:', webhookData);
        
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(webhookData)
        });
        
        console.log('Webhook response status:', webhookResponse.status);
        console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()));
        
        if (!webhookResponse.ok) {
          console.error('Webhook failed with status:', webhookResponse.status);
          const errorText = await webhookResponse.text();
          console.error('Webhook error response:', errorText);
        } else {
          const responseText = await webhookResponse.text();
          console.log('Webhook response body:', responseText);
          console.log('Webhook enviado com sucesso');
        }
      } catch (webhookError) {
        console.error('Erro detalhado do webhook:', {
          message: webhookError instanceof Error ? webhookError.message : 'Erro desconhecido',
          stack: webhookError instanceof Error ? webhookError.stack : undefined,
          name: webhookError instanceof Error ? webhookError.name : 'Unknown'
        });
        // Não interrompe o fluxo se o webhook falhar
      }

      // Adicionar o novo pensamento ao início da lista
      setThoughts(prev => [data, ...prev]);
      setCurrentThought('');
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    } catch (error) {
      console.error('Erro ao salvar pensamento:', error);
    } finally {
      setLoading(false);
    }
  };

  // Deletar pensamento do banco de dados
  const deleteThought = async (id: number) => {
    try {
      // Verificar se o Supabase está configurado
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Supabase não configurado - simulando exclusão');
        setThoughts(prev => prev.filter(thought => thought.id !== id));
        return;
      }
      
      const { error } = await supabase
        .from('frases')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar pensamento:', error);
        return;
      }

      setThoughts(prev => prev.filter(thought => thought.id !== id));
    } catch (error) {
      console.error('Erro ao deletar pensamento:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Aviso de configuração */}
      {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 px-4 py-3 text-center">
          <p className="text-sm">
            ⚠️ Supabase não configurado. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel.
          </p>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-xl">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Meus Pensamentos</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{today}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          <button
            onClick={() => setActiveView('write')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
              activeView === 'write'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <PenTool className="w-5 h-5" />
            <span className="font-medium">Escrever</span>
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
              activeView === 'history'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Histórico</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-8">
        {activeView === 'write' ? (
          // Write View
          <div className="space-y-6">
            {savedMessage && (
              <div className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 px-4 py-3 rounded-xl flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Pensamento salvo com sucesso!</span>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">O que você está pensando hoje?</span>
                </div>
                
                <textarea
                  value={currentThought}
                  onChange={(e) => setCurrentThought(e.target.value)}
                  placeholder="Escreva seus pensamentos, reflexões, ou qualquer coisa que esteja em sua mente..."
                  className="w-full h-64 resize-none border-0 outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed bg-transparent"
                  style={{ fontSize: '16px' }} // Prevent zoom on iOS
                  disabled={loading}
                />
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentThought.length} caracteres
                  </span>
                  <button
                    onClick={saveThought}
                    disabled={!currentThought.trim() || loading}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      currentThought.trim() && !loading
                        ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Salvando...' : 'Publicar'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // History View
          <div className="space-y-4">
            {loadingThoughts ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Carregando pensamentos...</p>
              </div>
            ) : thoughts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum pensamento salvo</h3>
                <p className="text-gray-600 dark:text-gray-400">Comece escrevendo seu primeiro pensamento do dia!</p>
              </div>
            ) : (
              thoughts.map((thought) => (
                <div key={thought.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {formatDate(thought.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteThought(thought.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{thought.frase}</p>
                  {thought.total_caracteres && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Total de caracteres: {thought.total_caracteres}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;