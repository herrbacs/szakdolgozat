import React from 'react'

type BaseModalProperties = {
  children: React.ReactNode;
  title: string,
  onClose: () => void,
}

const BaseModal = ({children, title, onClose }: BaseModalProperties) => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, .5)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0 }}>
      <div style={{ position: 'relative',backgroundColor: '#8f8f8f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '50%', maxWidth: '80%', maxHeight: '80%', borderRadius: '.5rem' }}>
        <div style={{ position: 'relative', padding: '.5rem 0 0 0', display: 'flex', flexDirection: 'column', minHeight: '1.5rem', width: '100%', color: '#FFFF' }}>
          <div style={{ width: '100%', fontSize: '1.5rem', textAlign: 'center' }}>{title}</div>
          <div style={{ position: 'absolute', right: '1rem', fontSize: '1.5rem', textAlign: 'center', cursor: 'pointer' }} onClick={onClose}>✕</div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default BaseModal