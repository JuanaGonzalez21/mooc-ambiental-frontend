'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  User, 
  MessageSquare,
  Github,
  Linkedin,
  Globe,
  Code,
  Heart,
  Star
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Resetear estado después de 3 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Contacto
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            ¿Tienes preguntas sobre el desarrollo de esta plataforma? ¿Necesitas ayuda técnica? 
            Estoy aquí para ayudarte en tu journey de aprendizaje .
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Formulario de Contacto */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Envíanos un mensaje
              </h2>
              <p className="text-gray-600">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Cuéntanos más detalles sobre tu consulta..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-medium text-white transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : submitStatus === 'success'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                } shadow-lg hover:shadow-xl`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Enviando...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Star className="h-5 w-5 mr-3" />
                    ¡Mensaje enviado!
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-3" />
                    Enviar mensaje
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    ✅ Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Información de Contacto y Desarrolladora */}
          <div className="space-y-8">
            
            {/* Información de Contacto */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Información de contacto
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Correo electrónico</h4>
                    <p className="text-gray-600">juana.gonzalez@campusucc.edu.co</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Teléfono</h4>
                    <p className="text-gray-600">+57 319714623</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Ubicación</h4>
                    <p className="text-gray-600">Bogotá, Colombia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de la Desarrolladora */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-6 sm:p-8 border border-purple-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Desarrollado con <Heart className="inline h-5 w-5 text-red-500" /> por
                </h3>
                <h4 className="text-xl font-semibold text-purple-700">
                  Juana Valentina González Ardila
                </h4>
                <p className="text-gray-600 mt-2">
                  Desarrolladora Full Stack & Especialista en Educación Digital
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h5 className="font-medium text-gray-900 mb-2">Sobre la desarrolladora</h5>
                  <p className="text-gray-600 text-sm">
                    Especialista en desarrollo web con pasión por la educación ambiental y la tecnología sostenible. 
                    Esta plataforma fue creada para democratizar el acceso a la educación ambiental de calidad.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h5 className="font-medium text-gray-900 mb-3">Tecnologías utilizadas</h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Next.js
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      React
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Node.js
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      MySQL
                    </span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                      Tailwind CSS
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h5 className="font-medium text-gray-900 mb-3">Conecta conmigo</h5>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                      title="GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                      title="Portfolio"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Rápido */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Preguntas frecuentes
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    ¿Cómo puedo inscribirme en un curso?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Simplemente crea una cuenta, navega por nuestros cursos y haz clic en &quot;Comenzar curso&quot; en el que te interese.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    ¿Los cursos tienen certificado?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Sí, al completar un curso recibirás un certificado digital que puedes descargar desde tu dashboard.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    ¿Hay soporte técnico disponible?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Por supuesto, puedes contactarnos a través de este formulario o enviarnos un email a soporte@moocambiental.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
