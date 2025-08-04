/*
  # Configurar políticas RLS para tabela frases

  1. Políticas de Segurança
    - Permitir inserção para usuários anônimos
    - Permitir leitura para usuários anônimos
    - Permitir exclusão para usuários anônimos

  2. Notas
    - Como este é um aplicativo de pensamentos pessoais simples, permitimos acesso anônimo
    - Em produção, considere implementar autenticação adequada
*/

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow anonymous insert" ON frases;
DROP POLICY IF EXISTS "Allow anonymous select" ON frases;
DROP POLICY IF EXISTS "Allow anonymous delete" ON frases;

-- Criar política para permitir inserção anônima
CREATE POLICY "Allow anonymous insert"
  ON frases
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Criar política para permitir leitura anônima
CREATE POLICY "Allow anonymous select"
  ON frases
  FOR SELECT
  TO anon
  USING (true);

-- Criar política para permitir exclusão anônima
CREATE POLICY "Allow anonymous delete"
  ON frases
  FOR DELETE
  TO anon
  USING (true);