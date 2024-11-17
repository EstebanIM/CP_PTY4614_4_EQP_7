import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import logo from '../../../public/Logo-carmotorfix.png'; // Logo importado

// Registrar fuentes
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { 
    padding: 40,
    fontSize: 10,
    fontFamily: 'Roboto',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  logoSection: {
    width: 200,
  },
  logo: {
    width: 120,
    height: 60,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyInfo: {
    marginRight: 20,
  },
  clientInfo: {
    width: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  invoiceDetails: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  table: {
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    paddingTop: 5,
    paddingBottom: 5,
  },
  description: { width: '40%' },
  quantity: { width: '15%' },
  price: { width: '15%' },
  vat: { width: '15%' },
  total: { width: '15%' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 5,
  },
  grandTotal: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
  },
});

const FacturaPDF = ({ companyData, clientData, servicios }) => {
  const calcularIVA = (precio, iva) => (precio * iva) / 100;
  const totalBase = servicios.reduce((sum, servicio) => sum + (servicio.precio * servicio.cantidad), 0);
  const totalIVA = servicios.reduce((sum, servicio) => sum + calcularIVA(servicio.precio * servicio.cantidad, servicio.iva), 0);
  const total = totalBase + totalIVA;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            {/* Usando el logo importado */}
            <Image style={styles.logo} src={logo} />
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.companyInfo}>
              <Text style={{ fontWeight: 'bold' }}>{companyData.name}</Text>
              <Text>NIF: {companyData.nif}</Text>
              <Text>{companyData.address}</Text>
              <Text>{companyData.city}</Text>
              <Text>Telf: {companyData.phone}</Text>
              <Text>{companyData.email}</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={{ fontWeight: 'bold' }}>{clientData.name}</Text>
              <Text>NIF: {clientData.nif}</Text>
              <Text>{clientData.address}</Text>
              <Text>{clientData.city}</Text>
              <Text>Telf: {clientData.phone}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Boleta</Text>

        <View style={styles.invoiceDetails}>
          <Text>Fecha factura: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Servicio</Text>
            <Text style={styles.price}>Precio de servicio</Text>
            <Text style={styles.vat}>Precio Variable</Text>
            <Text style={styles.total}>Total</Text>
          </View>
          {servicios.map((servicio, index) => {
            const subtotal = servicio.precio * servicio.cantidad;
            const iva = calcularIVA(subtotal, servicio.iva);
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.description}>{servicio.descripcion}</Text>
                <Text style={styles.quantity}>{servicio.cantidad}</Text>
                <Text style={styles.price}>${servicio.precio.toFixed(2)}</Text>
                <Text style={styles.vat}>${iva.toFixed(2)}</Text>
                <Text style={styles.total}>${(subtotal + iva).toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalsSection}>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>TOTAL:</Text>
            <Text>${total.toFixed(2)}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};

FacturaPDF.propTypes = {
  companyData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nif: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  clientData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nif: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  servicios: PropTypes.arrayOf(
    PropTypes.shape({
      descripcion: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
      precio: PropTypes.number.isRequired,
      iva: PropTypes.number.isRequired,
    })
  ).isRequired,
};

const FacturaConBoton = () => {
  const companyData = {
    name: "CarMotor Fix",
    nif: "123456789",
    address: "Calle Principal 123",
    city: "Santiago",
    phone: "912345678",
    email: "info@carmotorfix.cl"
  };

  const clientData = {
    name: "Carlos Rodríguez",
    nif: "987654321",
    address: "Av. Las Condes 456",
    city: "Santiago",
    phone: "987654321"
  };

  const servicios = [
    { descripcion: "Cambio de aceite de motor", cantidad: 1, precio: 250.00, iva: 21 },
    { descripcion: "Cambio de rueda delantera", cantidad: 1, precio: 200.00, iva: 21 },
    { descripcion: "Revisión de frenos", cantidad: 1, precio: 50.00, iva: 21 },
    { descripcion: "Mano de obra (horas)", cantidad: 3, precio: 40.00, iva: 21 },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <PDFDownloadLink
        document={
          <FacturaPDF
            companyData={companyData}
            clientData={clientData}
            servicios={servicios}
          />
        }
        fileName="BoletaCarmotorFix.pdf"
      >
        {({ loading }) => (loading ? <button disabled>Generando PDF...</button> : <button>Descargar Factura</button>)}
      </PDFDownloadLink>
    </div>
  );
};

export default FacturaConBoton;
