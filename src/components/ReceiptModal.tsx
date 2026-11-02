import React from 'react';
import { Order } from '../types/index.ts';
import { X, CheckCircle2, Download, Printer, ShieldCheck, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Header */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#0a2f24] text-white flex items-center justify-center font-bold text-lg mx-auto shadow-xs">
            MC
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">MC ACCADAMY</h2>
          <p className="text-xs text-slate-500">
            Rasiidka Lacag-Bixinta Rasmiga ah (Official Payment Receipt)
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lacagtu way Guuleysatay (Paid & Unlocked)</span>
          </div>
        </div>

        {/* Order & Transaction Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block">Lambarka Dalabka:</span>
            <span className="font-mono font-bold text-slate-900">{order.order_number}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Taariikhda:</span>
            <span className="font-medium text-slate-900">
              {new Date(order.created_at).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Ardayga:</span>
            <span className="font-semibold text-slate-900">{order.customer_name}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Taleefanka:</span>
            <span className="font-mono text-slate-900">{order.customer_phone || '-'}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400 block">Koorsada la iibsaday:</span>
            <span className="font-bold text-emerald-950 text-sm block mt-0.5">{order.course_title}</span>
          </div>
        </div>

        {/* Payment Gateway Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Albaabka (Gateway):</span>
            <span className="font-bold uppercase text-slate-800">
              {order.payment_gateway.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Habka (Method):</span>
            <span className="font-bold uppercase text-emerald-800">
              {order.payment_method.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tixraaca (Transaction Ref):</span>
            <span className="font-mono font-bold text-slate-700 truncate max-w-[180px]">
              {order.transaction_ref}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
            <span>Wadarta Lacagta:</span>
            <span className="text-emerald-900 tabular-nums">${order.amount} USD</span>
          </div>
        </div>

        {/* Security & Access Notice */}
        <div className="text-[11px] text-slate-500 text-center space-y-1">
          <p>Koorsadaada si toos ah ayaa laguu furay.</p>
          <p>Waxaad ka geli kartaa qaybta <strong>Koorsooyinkayga (My Courses)</strong> adigoo isticmaalaya emailkaaga ama taleefankaaga.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Daabaco (Print)</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#0a2f24] hover:bg-[#0d3b2e] text-white font-bold text-xs rounded-xl transition-colors"
          >
            Fasax (Done)
          </button>
        </div>

      </div>
    </div>
  );
};
