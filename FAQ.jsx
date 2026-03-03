import React from "react";
import { Helmet } from "react-helmet";
import PublicLayout from "@/components/layouts/PublicLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const faqData = [
  {
    category: "Primeiros Passos",
    questions: [
      {
        q: "O que é o Barbeiros.pt?",
        a: "O Barbeiros.pt é uma plataforma de comunidade premium desenhada especificamente para barbearias em Portugal. Oferece ferramentas de interação comunitária, análise de dados, compras em grupo e gestão de negócio.",
      },
      {
        q: "Como crio uma conta?",
        a: "Clique no botão 'Registar' na navegação superior, preencha os seus dados e verifique o seu endereço de e-mail para começar.",
      },
      {
        q: "Existe um período de teste gratuito?",
        a: "Sim! Oferecemos um período de teste de 14 dias para todos os novos utilizadores explorarem a plataforma e as suas funcionalidades.",
      },
    ],
  },
  {
    category: "Funcionalidades",
    questions: [
      {
        q: "Como funciona a funcionalidade de Comunidade?",
        a: "A funcionalidade de Comunidade permite-lhe ligar-se a outros proprietários de barbearias, partilhar experiências, publicar atualizações e interagir com os colegas através de gostos e comentários.",
      },
      {
        q: "Como funciona a Análise de Dados (Analytics)?",
        a: "O nosso painel de Analytics fornece informações detalhadas sobre o desempenho do seu negócio, incluindo tendências de agendamentos, métricas de faturação, horas de maior movimento e demografia de clientes.",
      },
      {
        q: "O que são as Compras em Grupo?",
        a: "As Compras em Grupo permitem que as barbearias unam o seu poder de compra para obter melhores preços em consumíveis e equipamentos, comprando em volume em conjunto.",
      },
    ],
  },
  {
    category: "Faturação",
    questions: [
      {
        q: "Quais os métodos de pagamento aceites?",
        a: "Aceitamos os principais cartões de crédito (Visa, Mastercard, American Express) e oferecemos faturação por transferência para planos anuais.",
      },
      {
        q: "Posso cancelar a minha subscrição a qualquer momento?",
        a: "Sim, pode cancelar a sua subscrição quando desejar. O seu acesso continuará ativo até ao final do período de faturação atual.",
      },
      {
        q: "Oferecem reembolsos?",
        a: "Oferecemos uma garantia de satisfação de 30 dias para todas as novas subscrições caso não fique satisfeito com a plataforma.",
      },
    ],
  },
  {
    category: "Diretrizes da Comunidade",
    questions: [
      {
        q: "Quais são as regras de publicação na comunidade?",
        a: "As publicações devem ser profissionais, respeitosas e relevantes para a indústria da barbearia. Não é permitido spam, conteúdo ofensivo ou material promocional sem autorização.",
      },
      {
        q: "Como denuncio conteúdo inadequado?",
        a: "Cada publicação tem um botão de denúncia. A nossa equipa de moderação analisa todas as denúncias num prazo de 24 horas.",
      },
      {
        q: "Posso partilhar as redes sociais da minha barbearia?",
        a: "Sim! Encorajamos a partilha do seu trabalho e perfis sociais, desde que seja feito de forma orgânica e não intrusiva.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Perguntas Frequentes - Barbeiros.pt</title>
        <meta name="description" content="Perguntas frequentes sobre as funcionalidades da plataforma Barbeiros.pt, faturação e diretrizes da comunidade." />
      </Helmet>

      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Perguntas <span className="text-gradient-gold">Frequentes</span>
            </h1>
            <p className="text-xl text-gray-400">
              Tudo o que precisa de saber sobre o Barbeiros.pt
            </p>
          </motion.div>

          <div className="space-y-12">
            {faqData.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-2 h-8 bg-[#FFD700] mr-4 rounded"></span>
                  {category.category}
                </h2>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${categoryIndex}-${index}`}
                      className="border border-gray-800 rounded-lg px-6 bg-black/50"
                    >
                      <AccordionTrigger className="text-left text-white hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center p-8 border border-gray-800 rounded-lg bg-black/50"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-400 mb-6">
              Não consegue encontrar a resposta que procura? Entre em contacto com a nossa equipa de suporte.
            </p>
            <Button className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
              Contactar Suporte
            </Button>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}