"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PdfPreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PdfPreviewModal({ isOpen, onClose }: PdfPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Ukážka výkazu knihy jázd</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 p-6 overflow-auto">
          {/* Placeholder pre obrázok výkazu */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">KNIHA JÁZD</h2>
                  
                  <div className="space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      <div>
                        <p className="text-sm text-gray-600">Vozidlo:</p>
                        <p className="font-semibold">BA123CD - Škoda Octavia</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Obdobie:</p>
                        <p className="font-semibold">Január 2024</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-2 font-bold text-sm text-gray-700 pb-2 border-b">
                        <span>Dátum</span>
                        <span>Od</span>
                        <span>Do</span>
                        <span>Km</span>
                        <span>Účel</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="grid grid-cols-5 gap-2 text-sm py-1">
                          <span>15.01.2024</span>
                          <span>Bratislava</span>
                          <span>Košice</span>
                          <span className="font-mono">395</span>
                          <span>Služobná cesta</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-sm py-1 bg-gray-50">
                          <span>16.01.2024</span>
                          <span>Bratislava</span>
                          <span>Trnava</span>
                          <span className="font-mono">55</span>
                          <span>Služobná cesta</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-sm py-1">
                          <span>17.01.2024</span>
                          <span>Bratislava</span>
                          <span>Ružinov</span>
                          <span className="font-mono">15</span>
                          <span>Súkromná</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t mt-4">
                        <div className="flex justify-between font-semibold">
                          <span>Celkovo služobných km:</span>
                          <span className="font-mono">450 km</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Celkovo súkromných km:</span>
                          <span className="font-mono">15 km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center pt-6 border-t">
                    <p className="text-sm text-gray-500">
                      Vygenerované elektronickou knihou jázd v súlade s § 85n zákona o DPH
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-muted-foreground text-sm">
                  Toto je len ukážka vzhľadu výkazu. Pre reálne používanie si vytvorte účet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}