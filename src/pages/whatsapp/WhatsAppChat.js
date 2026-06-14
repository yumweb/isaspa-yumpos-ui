import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Box,
  Alert,
  Typography,
  TextField,
  InputAdornment,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  IconButton,
  Divider,
  Paper,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import ArchiveIcon from "@mui/icons-material/Archive";
import InboxIcon from "@mui/icons-material/Inbox";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorIcon from "@mui/icons-material/Error";
import AddCommentIcon from "@mui/icons-material/AddComment";
import clientAdapter from "../../lib/clientAdapter";
import { getFeatureAccess, getUserInfo } from "../../lib/featureAccess";

const formatRelativeTime = (date) => {
  if (!date) return "";
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now - messageDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)
    return messageDate.toLocaleDateString(undefined, { weekday: "short" });
  return messageDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date) => {
  if (!date) return "";
  const msgDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) return "TODAY";
  if (msgDate.toDateString() === yesterday.toDateString()) return "YESTERDAY";
  return msgDate
    .toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
};

const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

const formatRemainingTime = (ms) => {
  if (!ms || ms <= 0) return "Expired";
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

const MessageStatus = ({ status }) => {
  switch (status) {
    case "pending":
      return <AccessTimeIcon sx={{ fontSize: 16, color: "#667781" }} />;
    case "sent":
      return <DoneIcon sx={{ fontSize: 16, color: "#667781" }} />;
    case "delivered":
      return <DoneAllIcon sx={{ fontSize: 16, color: "#667781" }} />;
    case "read":
      return <DoneAllIcon sx={{ fontSize: 16, color: "#53bdeb" }} />;
    case "failed":
      return <ErrorIcon sx={{ fontSize: 16, color: "#f44336" }} />;
    default:
      return null;
  }
};

export default function WhatsAppChat() {
  const locationInfo = JSON.parse(
    localStorage.getItem("yumpos_location") || "{}"
  );
  const locationId = locationInfo.locationId;

  // Left panel state
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("my-chats"); // 'my-chats' | 'archived'
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // Right panel state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isWithin24HourWindow, setIsWithin24HourWindow] = useState(false);
  const [windowRemainingMs, setWindowRemainingMs] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);

  // New chat dialog state
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState("");
  const [newChatTemplate, setNewChatTemplate] = useState("");
  const [startingChat, setStartingChat] = useState(false);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevMessageCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const scrollToBottom = useCallback((instant = false) => {
    // Use requestAnimationFrame to ensure DOM has been painted
    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      if (!container) return;

      if (instant) {
        // Immediate scroll for initial load
        container.scrollTop = container.scrollHeight;
      } else {
        // Smooth scroll for new messages
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth"
        });
      }
    });
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!locationId) return;
    try {
      const res = await clientAdapter.getWhatsappChatConversations(locationId, {
        status: "all",
        search,
        page: 1,
        limit: 100,
      });
      if (res?.success) {
        setConversations(res.data?.conversations || []);
      }
    } catch (e) {
      console.error("Error fetching conversations:", e);
    } finally {
      setLoading(false);
    }
  }, [locationId, search]);

  const fetchCounts = useCallback(async () => {
    if (!locationId) return;
    try {
      const res = await clientAdapter.getWhatsappChatUnreadCount(locationId);
      if (res?.success) {
        setUnreadCount(res.data?.unreadCount || 0);
      }
    } catch (e) {
      console.error("Error fetching counts:", e);
    }
  }, [locationId]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async () => {
    if (!locationId || !selectedConversationId) return;
    try {
      const res = await clientAdapter.getWhatsappChatMessages(
        locationId,
        selectedConversationId
      );
      if (res?.success) {
        setMessages(res.data?.messages || []);
        setSelectedConversation(res.data?.conversation);
        setIsWithin24HourWindow(res.data?.isWithin24HourWindow);
        setWindowRemainingMs(res.data?.windowRemainingMs);
      }
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  }, [locationId, selectedConversationId]);

  const fetchTemplates = useCallback(async () => {
    if (!locationId) return;
    try {
      const res = await clientAdapter.getWhatsappTemplates(locationId);
      if (res?.success) {
        const approved = (res.data || []).filter(
          (t) => t.status === "APPROVED"
        );
        setTemplates(approved);
      }
    } catch (e) {
      console.error("Error fetching templates:", e);
    }
  }, [locationId]);

  // Initial load
  useEffect(() => {
    if (locationId) {
      setLoading(true);
      fetchConversations();
      fetchCounts();
      fetchTemplates();

      const interval = setInterval(() => {
        fetchConversations();
        fetchCounts();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [
    locationId,
    search,
    fetchConversations,
    fetchCounts,
    fetchTemplates,
  ]);

  // Load messages when conversation selected
  useEffect(() => {
    if (selectedConversationId) {
      setMessagesLoading(true);
      setError(null);

      const loadMessages = async () => {
        try {
          const res = await clientAdapter.getWhatsappChatMessages(
            locationId,
            selectedConversationId
          );
          if (res?.success) {
            setMessages(res.data?.messages || []);
            setSelectedConversation(res.data?.conversation);
            setIsWithin24HourWindow(res.data?.isWithin24HourWindow);
            setWindowRemainingMs(res.data?.windowRemainingMs);
            await clientAdapter.markWhatsappChatAsRead(
              locationId,
              selectedConversationId
            );
            fetchConversations(); // Refresh to update unread count
            fetchCounts();
          }
        } catch (e) {
          setError("Error loading messages");
        } finally {
          setMessagesLoading(false);
        }
      };

      loadMessages();

      // Auto-refresh messages every 10 seconds
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [
    locationId,
    selectedConversationId,
    fetchMessages,
    fetchConversations,
    fetchCounts,
  ]);

  // Scroll to bottom when loading completes (initial load)
  useEffect(() => {
    // Only scroll when loading just finished and we have messages
    if (!messagesLoading && messages.length > 0 && isInitialLoadRef.current) {
      // Wait for DOM to update after loading completes
      requestAnimationFrame(() => {
        scrollToBottom(true);
        // Scroll again after images might have loaded
        setTimeout(() => scrollToBottom(true), 500);
      });
      isInitialLoadRef.current = false;
    }
  }, [messagesLoading, messages.length, scrollToBottom]);

  // Scroll to bottom when new messages arrive (not initial load)
  useEffect(() => {
    const currentCount = messages.length;
    const prevCount = prevMessageCountRef.current;

    // Only scroll for new messages after initial load is done
    if (!isInitialLoadRef.current && currentCount > prevCount && !messagesLoading) {
      scrollToBottom(false); // smooth scroll for new messages
    }

    prevMessageCountRef.current = currentCount;
  }, [messages.length, messagesLoading, scrollToBottom]);

  // Update 24hr window countdown
  useEffect(() => {
    if (windowRemainingMs > 0) {
      const interval = setInterval(() => {
        setWindowRemainingMs((prev) => Math.max(0, prev - 60000));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [windowRemainingMs]);

  const handleConversationClick = (conversation) => {
    setSelectedConversationId(conversation.id);
    setInputValue("");
    isInitialLoadRef.current = true; // Reset for new conversation
    prevMessageCountRef.current = 0;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sending) return;

    if (!isWithin24HourWindow) {
      setTemplateDialogOpen(true);
      return;
    }

    setSending(true);
    try {
      const res = await clientAdapter.sendWhatsappChatMessage(
        locationId,
        selectedConversationId,
        {
          type: "text",
          content: inputValue.trim(),
        }
      );
      if (res?.success) {
        setInputValue("");
        fetchMessages();
        fetchConversations();
      } else {
        setError(res?.error || "Failed to send message");
      }
    } catch (e) {
      setError("Error sending message");
    } finally {
      setSending(false);
    }
  };

  const handleSendTemplate = async () => {
    if (!selectedTemplate || sending) return;

    setSending(true);
    try {
      const res = await clientAdapter.sendWhatsappChatMessage(
        locationId,
        selectedConversationId,
        {
          type: "template",
          templateName: selectedTemplate,
          templateLanguage: "en",
        }
      );
      if (res?.success) {
        setTemplateDialogOpen(false);
        setSelectedTemplate("");
        fetchMessages();
        fetchConversations();
      } else {
        setError(res?.error || "Failed to send template");
      }
    } catch (e) {
      setError("Error sending template");
    } finally {
      setSending(false);
    }
  };

  const handleArchive = async () => {
    setMenuAnchor(null);
    try {
      await clientAdapter.archiveWhatsappChatConversation(
        locationId,
        selectedConversationId
      );
      setSelectedConversationId(null);
      setSelectedConversation(null);
      setMessages([]);
      fetchConversations();
    } catch (e) {
      setError("Error archiving conversation");
    }
  };

  const handleStartNewChat = async () => {
    if (!newChatPhone.trim() || !newChatTemplate || startingChat) return;

    // Clean phone number - remove spaces, dashes, etc
    let cleanPhone = newChatPhone.replace(/\D/g, "");
    // Add country code if not present (assuming India)
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    // Build variables based on template
    // ice_breaker template needs: header={{1}} (business name), body={{1}} (greeting like "there")
    const variables = {};
    if (newChatTemplate.startsWith("ice_breaker")) {
      variables.header = [locationInfo.name || "Our Business"];
      variables.body = ["there"];
    }

    setStartingChat(true);
    try {
      const res = await clientAdapter.startWhatsappChatConversation(
        locationId,
        {
          customerPhone: cleanPhone,
          templateName: newChatTemplate,
          templateLanguage: "en",
          variables: Object.keys(variables).length > 0 ? variables : undefined,
        }
      );

      if (res?.success) {
        setNewChatDialogOpen(false);
        setNewChatPhone("");
        setNewChatTemplate("");
        fetchConversations();
        // Select the new conversation
        if (res.data?.id) {
          setSelectedConversationId(res.data.id);
          isInitialLoadRef.current = true;
          prevMessageCountRef.current = 0;
        }
      } else {
        setError(res?.error || "Failed to start conversation");
      }
    } catch (e) {
      setError("Error starting conversation");
    } finally {
      setStartingChat(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Compute displayed conversations based on active tab
  const displayedConversations = useMemo(() => {
    switch (activeTab) {
      case "archived":
        return conversations.filter((c) => c.status === "archived");
      default: // 'my-chats'
        return conversations.filter((c) => c.status !== "archived");
    }
  }, [activeTab, conversations]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  // Gate the premium feature by enabled flag + expiry (corporate bypasses).
  const waAccess = getFeatureAccess(getUserInfo(), "whatsapp");
  if (!waAccess.active) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          {waAccess.expired
            ? `Your WhatsApp subscription expired${
                waAccess.expiry
                  ? " on " + new Date(waAccess.expiry).toLocaleDateString()
                  : ""
              }. Please contact your administrator to renew.`
            : "WhatsApp Business is not enabled for this location."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        bgcolor: "#f0f2f5",
        m: 2,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      {/* Left Panel - Chat List */}
      <Box
        sx={{
          width: 380,
          minWidth: 380,
          bgcolor: "#fff",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "#f0f2f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ color: "#111b21" }}>
            Chats
          </Typography>
          <IconButton
            onClick={() => setNewChatDialogOpen(true)}
            sx={{ color: "#54656f" }}
            title="Start new chat"
          >
            <AddCommentIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "#fff",
          }}
        >
          <Button
            onClick={() => setActiveTab("my-chats")}
            sx={{
              flex: 1,
              py: 1,
              px: 1,
              borderRadius: 0,
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: activeTab === "my-chats" ? 600 : 400,
              color: activeTab === "my-chats" ? "#00a884" : "#667781",
              borderBottom: activeTab === "my-chats" ? "2px solid #00a884" : "2px solid transparent",
              "&:hover": { bgcolor: "#f5f6f6" },
            }}
          >
            <Badge
              badgeContent={unreadCount}
              color="primary"
              max={99}
              sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", minWidth: 16, height: 16 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <InboxIcon sx={{ fontSize: 16 }} />
                My Chats
              </Box>
            </Badge>
          </Button>
          <Button
            onClick={() => setActiveTab("archived")}
            sx={{
              flex: 1,
              py: 1,
              px: 1,
              borderRadius: 0,
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: activeTab === "archived" ? 600 : 400,
              color: activeTab === "archived" ? "#00a884" : "#667781",
              borderBottom: activeTab === "archived" ? "2px solid #00a884" : "2px solid transparent",
              "&:hover": { bgcolor: "#f5f6f6" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ArchiveIcon sx={{ fontSize: 16 }} />
              Archived
            </Box>
          </Button>
        </Box>

        {/* Search */}
        <Box sx={{ px: 1.5, py: 1, bgcolor: "#fff" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f0f2f5",
                borderRadius: 2,
                height: 35,
                "& fieldset": { border: "none" },
              },
              "& .MuiInputBase-input": {
                py: 0.75,
                fontSize: "0.875rem",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#54656f", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider />

        {/* Conversation List */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} sx={{ color: "#00a884" }} />
          </Box>
        ) : displayedConversations.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: "#667781" }}>
            <ChatIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="body1">
              {activeTab === "archived"
                ? "No archived chats"
                : "No conversations yet"}
            </Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflow: "auto", py: 0 }}>
            {displayedConversations.map((conv) => (
              <ListItem
                key={conv.id}
                button
                onClick={() => handleConversationClick(conv)}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderBottom: "1px solid #f0f2f5",
                  bgcolor:
                    selectedConversationId === conv.id
                      ? "#f0f2f5"
                      : "transparent",
                  "&:hover": { bgcolor: "#f5f6f6" },
                  cursor: "pointer",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "#dfe5e7",
                      color: "#54656f",
                      width: 49,
                      height: 49,
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ ml: 1 }}
                  disableTypography
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: conv.unreadCount ? 600 : 400,
                          color: "#111b21",
                          fontSize: "1rem",
                        }}
                      >
                        {conv.customerName ||
                          formatPhoneNumber(conv.customerPhone)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: conv.unreadCount ? "#00a884" : "#667781",
                          fontSize: "0.75rem",
                        }}
                      >
                        {formatRelativeTime(conv.lastMessageAt)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#667781",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "80%",
                          fontSize: "0.875rem",
                        }}
                      >
                        {conv.customerName
                          ? formatPhoneNumber(conv.customerPhone)
                          : ""}
                      </Typography>
                      {conv.unreadCount > 0 ? (
                        <Box
                          sx={{
                            bgcolor: "#00a884",
                            color: "#fff",
                            borderRadius: "50%",
                            minWidth: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                        </Box>
                      ) : null}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Right Panel - Chat View or Empty State */}
      {selectedConversationId && selectedConversation ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#efeae2",
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              bgcolor: "#f0f2f5",
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#dfe5e7",
                color: "#54656f",
                width: 40,
                height: 40,
                mr: 1.5,
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 500, color: "#111b21", lineHeight: 1.2 }}
              >
                {selectedConversation?.customerName ||
                  formatPhoneNumber(selectedConversation?.customerPhone)}
              </Typography>
              {selectedConversation?.customerName && (
                <Typography variant="caption" sx={{ color: "#667781" }}>
                  {formatPhoneNumber(selectedConversation?.customerPhone)}
                </Typography>
              )}
            </Box>
            {/* 24hr Window Indicator */}
            <Chip
              icon={<ScheduleIcon sx={{ fontSize: 14 }} />}
              label={
                isWithin24HourWindow
                  ? `${formatRemainingTime(windowRemainingMs)} left`
                  : "Window expired"
              }
              size="small"
              sx={{
                bgcolor: isWithin24HourWindow ? "#e7f8e9" : "#fef3e2",
                color: isWithin24HourWindow ? "#00a884" : "#e65100",
                fontSize: "0.7rem",
                height: 24,
                mr: 1,
                "& .MuiChip-icon": {
                  color: isWithin24HourWindow ? "#00a884" : "#e65100",
                },
              }}
            />
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVertIcon sx={{ color: "#54656f" }} />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
            >
              <MenuItem onClick={handleArchive}>Archive chat</MenuItem>
            </Menu>
          </Box>

          {/* Messages Area */}
          <Box
            ref={messagesContainerRef}
            sx={{
              flex: 1,
              overflowY: "auto",
              backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGVSURBVHgB7dqxTsMwEAbgf0oW1g4sLEzsCIkH4XV4D14B1oqFIbABywCCISDB0qXJ+QK0KlJ9vmvt/0snJc3g+HN8iZ2IAAAAAAAAAACYGzNaDdvxzfN4Iq7KH6a77Jjb9e/iNJzXJn7c1wQ+KfFVdvwgcSWNLa+hhp3xHBaX8Gqq8Yd8nEcuMhV8xdpvXOG+Gs5VwwOswxvb8F4aXhHB7TQ8pYY31vBS1LD3DQ+ygZfF8AANK/GZLfioYR9u3IkXNezDjbtx4y5cuBUXbtqLCzfuxI37cOO3e3DhbhZu3I0b9+HG/bjwNRVu3IcbX0Phxn24cR9u3IcL9+LGXbhxJ27chwv348J9uPE1FW7chwv34MK9uHAXbtyJG/fhwv248DUVbtyHC/fgwr24cBdu3Ikb9+HC/bhwH258TYUb9+HCPbhwLy7chRt34sZ9uHA/LtyHG19T4cZ9uHAPLtyLC3fhxp24cR8u3I8L9+HG11S4cR8u3IML9+LCXbhxJ27chwv348J9uPE1FW7chwv34MK9uPB/+AWL8RQKA+3hIQAAAABJRU5ErkJggg==")`,
              px: 3,
              py: 2,
            }}
          >
            {messagesLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#00a884" }} />
              </Box>
            ) : (
              <>
                {error && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: "#ffebee",
                      borderRadius: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  </Box>
                )}

                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                  <Box key={date}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", my: 2 }}
                    >
                      <Chip
                        label={date}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.95)",
                          color: "#54656f",
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          px: 1,
                          boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                        }}
                      />
                    </Box>

                    {dateMessages
                      .filter((message) => {
                        // Skip rendering if message has no displayable content
                        const hasMedia = message.mediaUrl;
                        const hasContent =
                          message.content && message.content.trim();
                        return hasMedia || hasContent;
                      })
                      .map((message) => (
                        <Box
                          key={message.id}
                          sx={{
                            display: "flex",
                            justifyContent:
                              message.direction === "outbound"
                                ? "flex-end"
                                : "flex-start",
                            mb: 0.5,
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              maxWidth: "65%",
                              minWidth: 80,
                              px: 1.5,
                              py: 1,
                              borderRadius:
                                message.direction === "outbound"
                                  ? "7.5px 7.5px 0 7.5px"
                                  : "7.5px 7.5px 7.5px 0",
                              bgcolor:
                                message.direction === "outbound"
                                  ? "#d9fdd3"
                                  : "#fff",
                              boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                            }}
                          >
                            {/* Render image if message type is image */}
                            {message.messageType === "image" &&
                            message.mediaUrl ? (
                              <Box sx={{ mb: message.content ? 1 : 0 }}>
                                <img
                                  src={message.mediaUrl}
                                  alt="Shared image"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    window.open(message.mediaUrl, "_blank")
                                  }
                                />
                                {message.content && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#111b21",
                                      wordBreak: "break-word",
                                      whiteSpace: "pre-wrap",
                                      fontSize: "0.875rem",
                                      lineHeight: 1.4,
                                      mt: 1,
                                    }}
                                  >
                                    {message.content}
                                  </Typography>
                                )}
                              </Box>
                            ) : message.messageType === "video" &&
                              message.mediaUrl ? (
                              <Box sx={{ mb: message.content ? 1 : 0 }}>
                                <video
                                  src={message.mediaUrl}
                                  controls
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    borderRadius: "8px",
                                  }}
                                />
                                {message.content && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#111b21",
                                      wordBreak: "break-word",
                                      whiteSpace: "pre-wrap",
                                      fontSize: "0.875rem",
                                      lineHeight: 1.4,
                                      mt: 1,
                                    }}
                                  >
                                    {message.content}
                                  </Typography>
                                )}
                              </Box>
                            ) : message.messageType === "audio" &&
                              message.mediaUrl ? (
                              <Box>
                                <audio
                                  src={message.mediaUrl}
                                  controls
                                  style={{ width: "100%", maxWidth: "250px" }}
                                />
                              </Box>
                            ) : message.messageType === "document" &&
                              message.mediaUrl ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  p: 1,
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  borderRadius: 1,
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  window.open(message.mediaUrl, "_blank")
                                }
                              >
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: "#00a884",
                                    borderRadius: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {message.mediaMimeType
                                    ?.split("/")[1]
                                    ?.toUpperCase()
                                    ?.slice(0, 4) || "DOC"}
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#111b21" }}
                                >
                                  {message.content || "Document"}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#111b21",
                                  wordBreak: "break-word",
                                  whiteSpace: "pre-wrap",
                                  fontSize: "0.875rem",
                                  lineHeight: 1.4,
                                }}
                              >
                                {message.content}
                              </Typography>
                            )}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 0.25,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "#667781", fontSize: "0.6875rem" }}
                              >
                                {formatTime(message.timestamp)}
                              </Typography>
                              {message.direction === "outbound" && (
                                <MessageStatus status={message.status} />
                              )}
                            </Box>
                          </Paper>
                        </Box>
                      ))}
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              bgcolor: "#f0f2f5",
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={
                isWithin24HourWindow
                  ? "Type a message"
                  : "Select a template to send"
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending || !isWithin24HourWindow}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <IconButton
              onClick={
                isWithin24HourWindow
                  ? handleSendMessage
                  : () => setTemplateDialogOpen(true)
              }
              disabled={sending || (!inputValue.trim() && isWithin24HourWindow)}
              sx={{
                bgcolor: "#00a884",
                color: "#fff",
                width: 42,
                height: 42,
                "&:hover": { bgcolor: "#017561" },
                "&.Mui-disabled": { bgcolor: "#ccc", color: "#fff" },
              }}
            >
              {sending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </Box>
        </Box>
      ) : (
        // Empty State
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f0f2f5",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='%23e8e8e8' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}
        >
          <Box sx={{ textAlign: "center", maxWidth: 500, p: 4 }}>
            <Box
              sx={{
                width: 250,
                height: 250,
                margin: "0 auto 24px",
                opacity: 0.8,
              }}
            >
              <svg viewBox="0 0 303 172" preserveAspectRatio="xMidYMid meet">
                <path
                  fill="#00a884"
                  d="M229.565 160.229c32.647 0 59.095-26.442 59.095-59.082 0-32.647-26.448-59.095-59.095-59.095-32.641 0-59.089 26.448-59.089 59.095 0 32.64 26.448 59.082 59.089 59.082z"
                  opacity="0.1"
                />
                <path
                  fill="#00a884"
                  d="M73.255 160.229c32.647 0 59.095-26.442 59.095-59.082 0-32.647-26.448-59.095-59.095-59.095C40.608 42.052 14.16 68.5 14.16 101.147c0 32.64 26.448 59.082 59.095 59.082z"
                  opacity="0.1"
                />
              </svg>
            </Box>
            <Typography
              variant="h5"
              sx={{ color: "#41525d", fontWeight: 300, mb: 1 }}
            >
              Select a chat to start messaging
            </Typography>
          </Box>
        </Box>
      )}

      {/* Template Selection Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#00a884", color: "#fff" }}>
          Send Template Message
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            The 24-hour window has expired. You can only send approved template
            messages to restart the conversation.
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Template</InputLabel>
            <Select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              label="Select Template"
            >
              {templates.map((t) => (
                <MenuItem key={t.name} value={t.name}>
                  {t.name} ({t.category})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setTemplateDialogOpen(false)}
            sx={{ color: "#667781" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendTemplate}
            variant="contained"
            disabled={!selectedTemplate || sending}
            sx={{ bgcolor: "#00a884", "&:hover": { bgcolor: "#017561" } }}
          >
            {sending ? <CircularProgress size={20} color="inherit" /> : "Send"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Chat Dialog */}
      <Dialog
        open={newChatDialogOpen}
        onClose={() => {
          setNewChatDialogOpen(false);
          setNewChatPhone("");
          setNewChatTemplate("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#00a884", color: "#fff" }}>
          Start New Conversation
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the customer's phone number and select a template to initiate
            the conversation. The customer needs to reply to open a 24-hour
            messaging window.
          </Typography>
          <TextField
            fullWidth
            label="Phone Number"
            placeholder="e.g., 9876543210 or +91 98765 43210"
            value={newChatPhone}
            onChange={(e) => setNewChatPhone(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Select Template</InputLabel>
            <Select
              value={newChatTemplate}
              onChange={(e) => setNewChatTemplate(e.target.value)}
              label="Select Template"
            >
              {templates.map((t) => (
                <MenuItem key={t.name} value={t.name}>
                  {t.name} ({t.category})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {templates.length === 0 && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block" }}
            >
              No approved templates available. Create and get a template
              approved first.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setNewChatDialogOpen(false);
              setNewChatPhone("");
              setNewChatTemplate("");
            }}
            sx={{ color: "#667781" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartNewChat}
            variant="contained"
            disabled={!newChatPhone.trim() || !newChatTemplate || startingChat}
            sx={{ bgcolor: "#00a884", "&:hover": { bgcolor: "#017561" } }}
          >
            {startingChat ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Send Template"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
