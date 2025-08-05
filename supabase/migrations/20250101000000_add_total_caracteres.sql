-- Adicionar coluna total_caracteres à tabela frases
ALTER TABLE frases 
ADD COLUMN IF NOT EXISTS total_caracteres INTEGER;

-- Atualizar registros existentes com o total de caracteres
UPDATE frases 
SET total_caracteres = LENGTH(frase) 
WHERE total_caracteres IS NULL;

-- Criar índice para melhor performance em consultas por total_caracteres
CREATE INDEX IF NOT EXISTS idx_frases_total_caracteres 
ON frases(total_caracteres); 