import React from 'react'

type BaseModalProperties = {
  children: React.ReactNode
  title: string
  onClose: () => void
}

const BaseModal = ({ children, title, onClose }: BaseModalProperties) => {
  return (
    <div className="absolute inset-0 z-[950] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.35)] ring-1 ring-black/5">
        <div className="relative flex min-h-[5rem] items-center border-b border-slate-200/80 bg-gradient-to-r from-white via-slate-50 to-white px-6 py-5">
          <div className="w-full pr-10 text-center text-2xl font-semibold tracking-tight text-slate-800">
            {title}
          </div>
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  )
}

export default BaseModal
