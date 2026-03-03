import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Store, ShoppingCart, Star } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Comunidade",
    description: "Conecte-se com donos de barbearias em todo Portugal. Partilhe experiências, dicas e cresçam juntos.",
    link: "/app/community"
  },
  {
    icon: Store,
    title: "Expor o seu Negócio",
    description: "Apresente o seu negócio com fotos, portfólio, especialidades, localização e horários de funcionamento.",
    link: "/app/showcase"
  },
  {
    icon: ShoppingCart,
    title: "Compras em Grupo",
    description: "Junte o poder de compra com outras barbearias para obter os melhores negócios em suprimentos e equipamentos.",
    link: "/app/group-buy"
  },
];

const testimonials = [
  {
    name: "João Silva",
    shop: "Corte Fino, Lisboa",
    text: "O Barbeiros.pt transformou a forma como giro o meu negócio. A visibilidade que ganhei com a montra digital foi incrível.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    shop: "Estilo Premium, Porto",
    text: "A funcionalidade de comunidade é incrível. Conectei-me com tantos profissionais talentosos e aprendi muito.",
    rating: 5,
  },
  {
    name: "Carlos Ferreira",
    shop: "Barbearia Clássica, Braga",
    text: "As compras em grupo pouparam-me milhares em suprimentos. Esta plataforma paga-se a si mesma!",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Barbeiros.pt - Comunidade Premium de Barbearias</title>
        <meta name="description" content="Junte-se à plataforma comunitária premium para barbearias portuguesas. Conecte-se, exponha o seu negócio e expanda com o Barbeiros.pt" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582483720544-4068701c073d"
            alt="Interior de barbearia moderna com equipamento profissional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Barbeiros.pt
              <br />
              <span className="text-gradient-gold">Comunidade Premium</span>
              <br />
              de Barbearias
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Conecte-se com os melhores profissionais de barbearia de Portugal. 
              Exponha o seu talento, junte-se a compras em grupo exclusivas e expanda o seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <Button size="lg" className="bg-[#FFD700] text-black hover:bg-[#FFA500] text-lg px-8 py-6">
                  Começar
                </Button>
              </Link>
              <Link to="/faq">
                <Button size="lg" variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black text-lg px-8 py-6">
                  Saber Mais
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tudo o que Precisa para Ter <span className="text-gradient-gold">Sucesso</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Ferramentas poderosas desenhadas especificamente para donos de barbearias
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Link to={feature.link}>
                    <Card className="bg-black border-gray-800 hover:border-[#FFD700]/50 transition-all duration-300 h-full glass-effect group cursor-pointer">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-[#FFD700]/10 flex items-center justify-center mb-4 group-hover:bg-[#FFD700]/20 transition-colors">
                          <Icon className="h-6 w-6 text-[#FFD700]" />
                        </div>
                        <CardTitle className="text-white text-2xl group-hover:text-[#FFD700] transition-colors">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              O Que os Nossos <span className="text-gradient-gold">Membros</span> Dizem
            </h2>
            <p className="text-xl text-gray-400">
              Junte-se a centenas de donos de barbearias satisfeitos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-black border-gray-800 h-full">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-[#FFD700] fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.shop}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para Transformar o Seu <span className="text-gradient-gold">Negócio?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Junte-se ao Barbeiros.pt hoje e leve a sua barbearia ao próximo nível
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-[#FFD700] text-black hover:bg-[#FFA500] text-lg px-12 py-6">
                Iniciar Teste Gratuito
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}