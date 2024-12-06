/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type { ProductImage } from "@prisma/client";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { addProductImage, removeProductImage } from "@/server/actions/products";
import { Card } from "@repo/ui/components/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import { Progress } from "@repo/ui/components/ui/progress";
import { useProductImages } from "@/hooks/queries/useProducts";
import { useEdgeStore } from "@/providers/EdgeStoreProvider";
import ImagesSkeleton from "@/components/common/skeletons/ImagesSkeleton";
import DeleteAlertDialog from "@/components/common/DeleteAlertDialog";
import toast from "react-hot-toast";

export default function ProductImages({
  productId,
}: Readonly<{ productId: number }>) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const {
    data: images,
    refetch,
    isLoading,
    isRefetching,
  } = useProductImages({ id: productId });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      for (const element of e.target.files) {
        setFiles((prevState: File[]) => [...prevState, element]);
      }
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.file.length; i++) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function handleDragEnter(e: any) {
    handleDragOver(e);
  }

  function removeFile(idx: number) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.click();
  }

  const { edgestore } = useEdgeStore();

  const handleUpload = async () => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    files.forEach(async (file: File) => {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress: number) => {
          setProgress(progress);
          setUploading(true);
        },
      });
      addProductImage(productId, res.url);
      setUploading(false);
      refetch();
    });

    setFiles([]);
  };

  const handleDeleteImage = async (image: ProductImage) => {
    toast.loading("Eliminando Imagen");
    await removeProductImage(productId, image.id).then(async () => {
      await edgestore.publicFiles.delete({
        url: image.url,
      });
    });
    refetch();
    toast.dismiss();
  };

  return (
    <>
      {!uploading && images?.length === 0 ? (
        <Card className="mb-2 p-8 w-full text-destructive">
          No hay imagenes
        </Card>
      ) : (
        <>
          {(isLoading || isRefetching) && <ImagesSkeleton imagesCount={6} />}
          {!uploading && !isRefetching && (
            <Card className="gap-2 grid grid-cols-2 md:grid-cols-3 mb-2 p-2 h-[400px] overflow-auto !scroll-smooth scrollbar-thin">
              {images?.map((image: ProductImage) => (
                <div
                  className="relative flex flex-col justify-center items-center gap-1 text-center group"
                  key={image.id}
                >
                  <Image
                    src={image.url}
                    width={200}
                    className={cn(
                      "hover:opacity-90 shadow-sm border  object-cover"
                    )}
                    height={200}
                    alt={image.url}
                  />
                  <DeleteAlertDialog
                    title="Eliminar Imagen"
                    description="Seguro de eliminar la imagen del producto?"
                    onDelete={() => handleDeleteImage(image)}
                  />
                </div>
              ))}
            </Card>
          )}
        </>
      )}

      <Card
        className={cn(
          dragActive ? "bg-secondary" : "bg-background",
          "p-4 text-sm text-center"
        )}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        {uploading ? (
          <div className="flex flex-col justify-center items-center">
            <p className="font-bold text-lg">{progress}%</p>
            <Progress value={progress} />
            <p className="text-sm">Subiendo Imágenes</p>
          </div>
        ) : (
          <form>
            <input
              placeholder="fileInput"
              name="images"
              className="hidden"
              ref={inputRef}
              type="file"
              multiple={true}
              onChange={handleChange}
              accept="image/*"
            />
            <Upload className="mx-auto mb-4 w-8 h-8" />
            <div className="mx-auto mb-4">
              <div>Arrastra y suelta o</div>
              <Button
                type="button"
                variant="secondaryBordered"
                onClick={openFileExplorer}
              >
                selecciona Imágenes
              </Button>
              <div>para subir</div>
            </div>
            <div className="mx-auto mt-2 w-full md:w-1/2">
              {files.map((file: File, idx: number) => (
                <div
                  key={file.name}
                  className="items-center grid grid-cols-3 p-3 border w-full"
                >
                  <span className="flex justify-start">{file.name}</span>
                  <span>{file.size} bytes</span>
                  <span className="flex justify-end">
                    <Button
                      variant="destructiveOutline"
                      size="icon"
                      className="w-6 h-6"
                      type="button"
                      onClick={() => removeFile(idx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </span>
                </div>
              ))}
            </div>
            <input
              type="hidden"
              name="productId"
              value={productId.toString()}
            />
            <Button
              type="button"
              className="mt-4"
              onClick={handleUpload}
              variant="shine"
              disabled={files.length === 0 || uploading}
            >
              <span className="p-2 text-white">Subir Imagenes</span>
            </Button>
          </form>
        )}
      </Card>
    </>
  );
}
