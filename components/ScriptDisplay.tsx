
import React from 'react';
import { ScriptData, Scene } from '../types';

interface ScriptDisplayProps {
    scriptData: ScriptData | null;
    isLoading: boolean;
}

const ScriptSection: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20">
        <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
            <span className="text-xl mr-3">{icon}</span>
            {title}
        </h3>
        <div className="text-gray-300 space-y-2">{children}</div>
    </div>
);

const SceneCard: React.FC<{ scene: Scene }> = ({ scene }) => (
    <div className="bg-gray-900/50 p-4 rounded-md border-l-4 border-cyan-500">
        <h4 className="font-bold text-cyan-400">🎬 场景 {scene.sceneNumber}</h4>
        <p className="mt-2"><strong className="text-gray-400">视觉:</strong> {scene.visuals}</p>
        <p className="mt-1"><strong className="text-gray-400">台词/旁白:</strong> {scene.dialogue}</p>
    </div>
);

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ scriptData, isLoading }) => {
    
    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                    <h2 className="mt-6 text-xl font-semibold text-gray-300">专家团队正在为您精心策划...</h2>
                    <p className="text-gray-500 mt-2">营销策略师、金牌编剧和视觉导演正在激烈讨论中，请稍候片刻。</p>
                </div>
            );
        }

        if (!scriptData) {
            return (
                 <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="text-5xl mb-4">📜</div>
                    <h2 className="text-2xl font-bold text-gray-300">视频创作指导书</h2>
                    <p className="text-gray-500 mt-2">完成左侧的对话后，您的专属视频方案将在这里生成。</p>
                </div>
            )
        }
        
        return (
            <div className="space-y-6">
                <ScriptSection title="目标人群画像" icon="👥">
                    <p>{scriptData.targetAudience}</p>
                </ScriptSection>

                <ScriptSection title="核心创意 (HOOK)" icon="💡">
                    <p className="italic text-lg">"{scriptData.coreCreativeHook}"</p>
                </ScriptSection>

                <ScriptSection title="故事线 / 脚本" icon="🎞️">
                    <div className="space-y-4">
                        {scriptData.storyline.map((scene, index) => <SceneCard key={index} scene={scene} />)}
                    </div>
                </ScriptSection>

                <ScriptSection title="情绪价值点" icon="💖">
                    <ul className="list-disc list-inside">
                        {scriptData.emotionalValuePoints.map((point, index) => <li key={index}>{point}</li>)}
                    </ul>
                </ScriptSection>

                <ScriptSection title="引导下单话术 (Call To Action)" icon="🚀">
                     <p>{scriptData.callToAction}</p>
                </ScriptSection>
            </div>
        );
    };

    return (
        <div className="flex-1 bg-gray-900 overflow-y-auto">
             <header className="sticky top-0 p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm z-10">
                <h2 className="text-xl font-bold text-center text-gray-200">视频创作指导书</h2>
            </header>
            <div className="p-6 md:p-8">
                {renderContent()}
            </div>
        </div>
    );
};
