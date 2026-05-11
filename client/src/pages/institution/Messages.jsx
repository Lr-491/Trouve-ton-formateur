import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Building2, FileText, Users, ArrowRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { messageAPI } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const NAVIGATION = [
  { label: "Tableau de bord", href: "/dashboard/institution", icon: <Building2 size={18} /> },
  { label: "Mon profil", href: "/profil/institution", icon: <Building2 size={18} /> },
  { label: "Mes offres", href: "/institution/offres", icon: <FileText size={18} /> },
  { label: "Candidatures reçues", href: "/institution/candidatures", icon: <Users size={18} /> },
  { label: "Messagerie", href: "/institution/messages", icon: <MessageSquare size={18} /> },
  { label: "Recherche formateurs", href: "/recherche/formateurs", icon: <ArrowRight size={18} /> },
];

const MessagesInstitution = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await messageAPI.getConversations();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    const fetchMessages = async () => {
      try {
        const data = await messageAPI.getConversation(activeConv.other_user);
        setMessages(data.messages || []);
      } catch (err) { console.error(err); }
    };
    fetchMessages();
  }, [activeConv]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConv) return;
    setSending(true);
    try {
      await messageAPI.envoyer({ destinataire_id: activeConv.other_user, contenu: newMessage.trim() });
      setNewMessage("");
      const data = await messageAPI.getConversation(activeConv.other_user);
      setMessages(data.messages || []);
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  return (
    <DashboardLayout navigation={NAVIGATION}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Messagerie</h1>
        <p className="text-slate-500 text-sm mt-1">Échangez avec les formateurs</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
        <div className="flex h-full">
          <div className="w-72 border-r border-slate-200 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <p className="text-center text-slate-400 text-sm py-8">Chargement...</p>
              ) : conversations.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">Aucune conversation</p>
              ) : conversations.map((conv, i) => (
                <button key={i} onClick={() => setActiveConv(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all text-left border-b border-slate-50 ${activeConv?.other_user === conv.other_user ? "bg-blue-50 border-l-2 border-l-blue-600" : ""}`}
                >
                  <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                    {conv.other_user_email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{conv.other_user_email}</p>
                    <p className="text-xs text-slate-400 truncate">{conv.dernier_message}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {!activeConv ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Sélectionnez une conversation</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {activeConv.other_user_email?.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{activeConv.other_user_email}</p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                  {messages.map((m, i) => {
                    const isMine = m.expediteur_id === user.id;
                    return (
                      <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMine ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-900 rounded-bl-sm"}`}>
                          <p>{m.contenu}</p>
                          <p className={`text-xs mt-1 ${isMine ? "text-blue-200" : "text-slate-400"}`}>
                            {new Date(m.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-3">
                  <input
                    type="text" value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Écrire un message..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button onClick={handleSend} disabled={sending || !newMessage.trim()}
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50">
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesInstitution;