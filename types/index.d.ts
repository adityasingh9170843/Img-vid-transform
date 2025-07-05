export interface Video{
    id: string
    title: string
    description: string
    createdAt: Date
    publicId: string
    originalSize: number
    duration?: number
    compressedSize?: number
}