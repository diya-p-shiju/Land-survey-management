import React from 'react'
import { Typography } from '@mui/material'
import { styled } from '@mui/system'

const Background = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '50px',
  boxSizing: 'border-box',
})

const Content = styled('div')({
  background: 'linear-gradient(to bottom right, #2196F3, #21CBF3)', // Gradient background
  padding: '150px',
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
  color: '#000',
  maxWidth: '800px',
  width: '100%',
})

const AboutUs = () => {
  return (
    <div id="about">
    <Background>
      <Content>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold', color: '#fff' }}>
          About Us
        </Typography>
        <Typography variant="body1" style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#f0f0f0' }}>
          As a leading land survey company, we provide accurate and reliable surveying services to meet all your needs. Our team of experienced professionals uses the latest technology to deliver precise measurements and detailed reports. Whether you need boundary surveys, topographic surveys, or construction staking, we are here to help you with all your land surveying requirements.
        </Typography>
      </Content>
    </Background>
    </div>
  )
}

export default AboutUs
