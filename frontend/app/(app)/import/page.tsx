"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getGpsDevices } from "@/lib/api/gps-devices"
import { uploadGpsFile } from "@/lib/api/gps-devices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"

export default function ImportPage() {
  const [selectedDevice, setSelectedDevice] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const { data: devices = [] } = useQuery({
    queryKey: ["gps-devices"],
    queryFn: getGpsDevices,
  })

  const activeDevices = devices.filter((d) => d.isActive)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file || !selectedDevice) {
      toast({
        title: "Chyba",
        description: "Vyberte zariadenie a súbor",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadStatus("idle")

    try {
      const device = devices.find((d) => d.id === selectedDevice)
      if (!device) throw new Error("Zariadenie nenájdené")

      await uploadGpsFile(file, device.serialNumber)

      setUploadStatus("success")
      toast({
        title: "Súbor nahraný",
        description: "GPS údaje sa spracúvajú",
      })

      // Reset form
      setFile(null)
      setSelectedDevice("")
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      setUploadStatus("error")
      toast({
        title: "Chyba pri nahrávaní",
        description: error instanceof Error ? error.message : "Nepodarilo sa nahrať súbor",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import GPS údajov</h1>
        <p className="text-muted-foreground">Nahrajte súbor z USB GPS modulu pre automatické generovanie jázd</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Nahrať GPS súbor</CardTitle>
            <CardDescription>Vyberte GPS zariadenie a nahrajte súbor s údajmi o jazdách</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="device">GPS zariadenie</Label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger id="device">
                  <SelectValue placeholder="Vyberte GPS zariadenie" />
                </SelectTrigger>
                <SelectContent>
                  {activeDevices.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Žiadne aktívne zariadenia
                    </SelectItem>
                  ) : (
                    activeDevices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.serialNumber}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Súbor</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.txt,.log"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {file && <div className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</div>}
              </div>
              <p className="text-xs text-muted-foreground">Podporované formáty: CSV, TXT, LOG</p>
            </div>

            <Button onClick={handleUpload} disabled={!file || !selectedDevice || uploading} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Nahrávam..." : "Nahrať súbor"}
            </Button>

            {uploadStatus === "success" && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800 dark:text-green-200">Úspešne nahraté</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Súbor bol nahraný a spracováva sa. Jazdy budú čoskoro k dispozícii v systéme.
                </AlertDescription>
              </Alert>
            )}

            {uploadStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Chyba pri nahrávaní</AlertTitle>
                <AlertDescription>
                  Nepodarilo sa nahrať súbor. Skúste to znova alebo kontaktujte podporu.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ako to funguje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                1
              </div>
              <div>
                <div className="font-medium">Pripojte GPS modul k PC</div>
                <p className="text-sm text-muted-foreground">
                  Pripojte USB GPS modul k vášmu počítaču a nájdite súbor s údajmi
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                2
              </div>
              <div>
                <div className="font-medium">Vyberte zariadenie a súbor</div>
                <p className="text-sm text-muted-foreground">Vyberte správne GPS zariadenie a nahrajte súbor</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                3
              </div>
              <div>
                <div className="font-medium">Jazdy sa automaticky vytvorí</div>
                <p className="text-sm text-muted-foreground">
                  Systém spracuje GPS údaje a vytvorí jazdy, ktoré môžete následne upraviť
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
