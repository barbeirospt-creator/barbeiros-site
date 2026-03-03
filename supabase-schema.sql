-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela: tabela_barbearias
CREATE TABLE IF NOT EXISTS public.tabela_barbearias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    localizacao TEXT, -- Pode armazenar "Cidade, Distrito" ou JSON string
    descricao TEXT,
    logo TEXT,
    horarios JSONB DEFAULT '[]'::jsonb,
    contactos JSONB DEFAULT '{}'::jsonb,
    avaliacao_media NUMERIC DEFAULT 0,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: tabela_reviews
CREATE TABLE IF NOT EXISTS public.tabela_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID REFERENCES public.tabela_barbearias(id) ON DELETE CASCADE,
    cliente_nome TEXT,
    avaliacao INTEGER CHECK (avaliacao >= 1 AND avaliacao <= 5),
    comentario TEXT,
    data TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: tabela_servicos
CREATE TABLE IF NOT EXISTS public.tabela_servicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID REFERENCES public.tabela_barbearias(id) ON DELETE CASCADE,
    nome_servico TEXT NOT NULL,
    preco NUMERIC NOT NULL,
    duracao INTEGER, -- minutos
    descricao TEXT
);

-- Tabela: tabela_agendamentos
CREATE TABLE IF NOT EXISTS public.tabela_agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID REFERENCES public.tabela_barbearias(id) ON DELETE CASCADE,
    cliente_nome TEXT NOT NULL,
    servico TEXT NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    preco NUMERIC,
    status TEXT DEFAULT 'pendente' -- pendente, confirmado, cancelado, concluido
);

-- Tabela: tabela_usuarios
-- Relaciona usuários autenticados (auth.users) com barbearias
CREATE TABLE IF NOT EXISTS public.tabela_usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    tipo_usuario TEXT DEFAULT 'cliente', -- dono, funcionario, cliente
    barbearia_id UUID REFERENCES public.tabela_barbearias(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: tabela_imagens_barbearia
CREATE TABLE IF NOT EXISTS public.tabela_imagens_barbearia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbearia_id UUID REFERENCES public.tabela_barbearias(id) ON DELETE CASCADE,
    url_imagem TEXT NOT NULL,
    tipo TEXT DEFAULT 'galeria', -- galeria, cover, interior, portfolio
    descricao TEXT
);

-- RLS Policies (Exemplos básicos para permitir leitura pública e escrita autenticada)
ALTER TABLE public.tabela_barbearias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de barbearias" ON public.tabela_barbearias FOR SELECT USING (true);
CREATE POLICY "Donos editam suas barbearias" ON public.tabela_barbearias FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tabela_usuarios WHERE id = auth.uid() AND barbearia_id = public.tabela_barbearias.id)
);

ALTER TABLE public.tabela_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de reviews" ON public.tabela_reviews FOR SELECT USING (true);
CREATE POLICY "Clientes criam reviews" ON public.tabela_reviews FOR INSERT WITH CHECK (true);

ALTER TABLE public.tabela_servicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de serviços" ON public.tabela_servicos FOR SELECT USING (true);
CREATE POLICY "Donos gerenciam serviços" ON public.tabela_servicos FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tabela_usuarios WHERE id = auth.uid() AND barbearia_id = public.tabela_servicos.barbearia_id)
);

ALTER TABLE public.tabela_imagens_barbearia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de imagens" ON public.tabela_imagens_barbearia FOR SELECT USING (true);
CREATE POLICY "Donos gerenciam imagens" ON public.tabela_imagens_barbearia FOR ALL USING (
    EXISTS (SELECT 1 FROM public.tabela_usuarios WHERE id = auth.uid() AND barbearia_id = public.tabela_imagens_barbearia.barbearia_id)
);