import { useState } from "react";
import { extrairMLB } from '@/app/utils/regex';
import { useRouter } from "next/navigation";
import { formatarMoeda } from "../utils/preco";
import { Star, ExternalLink, Eye } from "lucide-react";

export default function Card({ post }) {
    const [index, setIndex] = useState(0);

    const router = useRouter();
    const MLB_ID = extrairMLB(post.url);

    function carregarProduto() {
        router.push(`/produto/${MLB_ID}?url=${encodeURIComponent(post.url)}`);
    };

    return (
        <div className="card group relative bg-white rounded-lg shadow-md flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
            <div className="img-container w-full h-48 md:h-60 p-2.5 mb-3 flex items-center justify-center relative overflow-hidden bg-gray-50">
                {post.images.map((img, i) => (
                    <img
                        key={img.id}
                        src={img.url}
                        alt={`${post.title} - imagem ${i + 1}`}
                        className={`${i === index ? 'block' : 'hidden'} max-w-full max-h-full object-contain transition-opacity duration-200`}
                        loading="lazy"
                    />
                ))}

                {post.images.length > 1 && (
                    <>
                        <button
                            className="prev absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/70 hover:bg-black text-white border-none cursor-pointer p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIndex((index - 1 + post.images.length) % post.images.length);
                            }}
                            aria-label="Imagem anterior"
                        >
                            ‹
                        </button>
                        <button
                            className="next absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/70 hover:bg-black text-white border-none cursor-pointer p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIndex((index + 1) % post.images.length);
                            }}
                            aria-label="Próxima imagem"
                        >
                            ›
                        </button>

                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                            {post.images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIndex(i);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${i === index
                                            ? 'bg-primary w-4'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Ir para imagem ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {post.discount && (
                    <span className="discount absolute top-3 right-3 bg-green-600 text-white text-xs md:text-sm font-bold px-2.5 py-1 rounded-md shadow-md">
                        {post.discount}
                    </span>
                )}
            </div>

            <div className="content p-4 flex flex-col gap-3 flex-1">
                <h3
                    className="text-sm md:text-base font-semibold cursor-pointer hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]"
                    onClick={carregarProduto}
                >
                    {post.title}
                </h3>

                <div className="item-details flex-1">
                    {post.previous_price && (
                        <p className="previous-price line-through text-gray-500 text-sm">
                            {formatarMoeda(post.previous_price)}
                        </p>
                    )}

                    <p className="current-price font-bold text-xl md:text-2xl text-gray-900 mb-2">
                        {formatarMoeda(post.current_price)}
                    </p>

                    {post.rating ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{post.rating}</span>
                            {post.rating_text && (
                                <span className="text-gray-500">• {post.rating_text}</span>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Sem avaliações</p>
                    )}
                </div>

                <div className="actions flex gap-2 mt-auto pt-3 border-t border-gray-100">
                    <button
                        onClick={carregarProduto}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Detalhes</span>
                    </button>

                    <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary text-secondary px-4 py-2.5 rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all font-medium text-sm flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">Ver no ML</span>
                    </a>
                </div>
            </div>
        </div>
    );
}