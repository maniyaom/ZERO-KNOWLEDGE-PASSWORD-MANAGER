import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import { styled, useTheme } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import KeyIcon from "@mui/icons-material/Key";
import axios from "axios";

const GlowBox = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    padding: "1px",
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
  },
}));

const GridPatternBg = styled(Box)({
  position: "absolute",
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px)
  `,
  backgroundSize: "60px 60px",
  pointerEvents: "none",
});

interface CustomResponse {
  success: boolean;
  message: string;
  data: {
    password: string;
  };
}

const SERVER_URL = "http://localhost:3000";

async function derivePassword(
  masterKey: string,
  service: string,
  identifier: string,
): Promise<string> {
  const response = await axios.post<CustomResponse>(
    `${SERVER_URL}/generate-password`,
    { masterPassword: masterKey, service, identifier },
  );
  return response.data.data.password;
}

const features = [
  {
    icon: <ShieldOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Zero Knowledge",
    description:
      "Your master key never leaves your device. We never store or see your passwords — ever.",
  },
  {
    icon: <StorageOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Nothing Stored",
    description:
      "No database of passwords to hack. Every password is derived on-demand from your inputs.",
  },
  {
    icon: <AutorenewIcon sx={{ fontSize: 32 }} />,
    title: "Always Reproducible",
    description:
      "Same inputs always produce the same password. No sync required — works everywhere.",
  },
  {
    icon: <DevicesOutlinedIcon sx={{ fontSize: 32 }} />,
    title: "Works Anywhere",
    description:
      "Open it on any device, any browser. No account, no install, no cloud dependency.",
  },
];

const howItWorks = [
  {
    step: "01",
    label: "Enter your secret master key",
    sub: "Only you know this. It never leaves your browser.",
  },
  {
    step: "02",
    label: "Specify the service",
    sub: "e.g. google, github, netflix",
  },
  {
    step: "03",
    label: "Add your identifier",
    sub: "Your email, username, or phone number",
  },
  {
    step: "04",
    label: "Get your unique password",
    sub: "Cryptographically derived. Unique per service.",
  },
];

export default function LandingPage() {
  const theme = useTheme();

  const [masterKey, setMasterKey] = useState("");
  const [service, setService] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showMasterKey, setShowMasterKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const canGenerate =
    masterKey.trim().length >= 4 &&
    service.trim().length > 0 &&
    identifier.trim().length > 0;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError("");
    setPassword("");
    setCopied(false);
    try {
      const result = await derivePassword(masterKey, service, identifier);
      setPassword(result);
    } catch {
      setError("Failed to generate password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canGenerate) {
      handleGenerate();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 8, md: 14 },
          pb: { xs: 10, md: 16 },
        }}
      >
        <GridPatternBg />
        {/* Radial glow blobs */}
        <Box
          sx={{
            position: "absolute",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(0, 229, 255, 0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 100,
            right: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(124, 77, 255, 0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative" }}>
          {/* Badge */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Chip
              icon={<LockOutlinedIcon sx={{ fontSize: "14px !important" }} />}
              label="Zero Trust Architecture"
              variant="outlined"
              size="small"
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                fontWeight: 600,
                letterSpacing: "0.5px",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            />
          </Box>

          {/* Headline */}
          <Typography
            variant="h1"
            component="h1"
            align="center"
            sx={{
              fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem", lg: "4.5rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Passwords Derived,
            <br />
            Never Stored
          </Typography>

          <Typography
            variant="h5"
            component="p"
            align="center"
            sx={{
              color: "text.secondary",
              maxWidth: 560,
              mx: "auto",
              mb: { xs: 6, md: 8 },
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            One master key. Any service. Any device. Your passwords are
            cryptographically derived — no database, no breach risk.
          </Typography>

          {/* Generator Form Card */}
          <GlowBox
            sx={{
              maxWidth: 560,
              mx: "auto",
              borderRadius: 3,
            }}
          >
            <Card
              elevation={0}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                border: "none",
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: "rgba(0, 229, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                    }}
                  >
                    <VpnKeyOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, lineHeight: 1.2 }}
                    >
                      Generate Password
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      All processing happens in your browser
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  <TextField
                    fullWidth
                    label="Master Key"
                    type={showMasterKey ? "text" : "password"}
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Your secret master key"
                    helperText="Minimum 4 characters. Never shared or stored."
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon
                              sx={{ color: "primary.main", fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowMasterKey((v) => !v)}
                              edge="end"
                              aria-label={
                                showMasterKey
                                  ? "Hide master key"
                                  : "Show master key"
                              }
                            >
                              {showMasterKey ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. google, github, netflix"
                    helperText="The website or app name"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessOutlinedIcon
                              sx={{ color: "primary.main", fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="email, username or phone"
                    helperText="Your email, username or phone number for that service"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon
                              sx={{ color: "primary.main", fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleGenerate}
                    disabled={!canGenerate || loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <KeyIcon />
                      )
                    }
                    sx={{
                      mt: 0.5,
                      py: 1.5,
                      fontSize: "1rem",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "rgba(0, 229, 255, 0.12)",
                        color: "rgba(0, 229, 255, 0.3)",
                      },
                    }}
                  >
                    {loading ? "Generating…" : "Generate Password"}
                  </Button>

                  {error && (
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{ borderRadius: 2 }}
                    >
                      {error}
                    </Alert>
                  )}

                  {password && !error && (
                    <Box
                      sx={{
                        borderRadius: 2,
                        bgcolor: "rgba(0, 230, 118, 0.06)",
                        border: "1px solid rgba(0, 230, 118, 0.2)",
                        p: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "success.main",
                          fontWeight: 600,
                          display: "block",
                          mb: 1,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Your Generated Password
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          sx={{
                            fontFamily: '"Roboto Mono", monospace',
                            fontSize: { xs: "0.95rem", sm: "1.1rem" },
                            fontWeight: 600,
                            letterSpacing: "2px",
                            color: "success.main",
                            flexGrow: 1,
                            wordBreak: "break-all",
                            filter: showPassword ? "none" : "blur(6px)",
                            transition: "filter 0.2s ease",
                            userSelect: showPassword ? "text" : "none",
                          }}
                        >
                          {password}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title={showPassword ? "Hide" : "Reveal"}>
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword((v) => !v)}
                              sx={{ color: "success.main" }}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={copied ? "Copied!" : "Copy to clipboard"}
                          >
                            <IconButton
                              size="small"
                              onClick={handleCopy}
                              sx={{
                                color: copied
                                  ? "success.main"
                                  : "text.secondary",
                              }}
                            >
                              {copied ? (
                                <CheckCircleOutlineIcon fontSize="small" />
                              ) : (
                                <ContentCopyIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          mt: 1,
                          display: "block",
                        }}
                      >
                        Paste it immediately. Do not save it here — generate it
                        again anytime.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </GlowBox>
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "rgba(0, 229, 255, 0.02)" }}>
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            align="center"
            display="block"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: "2px",
              mb: 1,
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
            }}
          >
            Four steps to a secure password
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ color: "text.secondary", mb: 8, maxWidth: 480, mx: "auto" }}
          >
            No signup. No storage. No sync. Your password is mathematically
            reproduced each time.
          </Typography>

          <Grid container spacing={3}>
            {howItWorks.map((item) => (
              <Grid key={item.step} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid rgba(0, 229, 255, 0.08)",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    transition: "border-color 0.2s",
                    "&:hover": {
                      borderColor: "rgba(0, 229, 255, 0.25)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: "2rem",
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1,
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, lineHeight: 1.3 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.sub}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Divider sx={{ borderColor: "rgba(0, 229, 255, 0.06)" }} />

      {/* Features */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            align="center"
            display="block"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: "2px",
              mb: 1,
            }}
          >
            Why Zero Trust
          </Typography>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
            }}
          >
            Security by design
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ color: "text.secondary", mb: 8, maxWidth: 480, mx: "auto" }}
          >
            Traditional password managers are single points of failure. ZeroKey
            has no server to hack.
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid key={feature.title} size={{ xs: 12, sm: 6 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    bgcolor: "background.paper",
                    transition: "border-color 0.2s, transform 0.2s",
                    "&:hover": {
                      borderColor: "rgba(0, 229, 255, 0.25)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2.5,
                        bgcolor: "rgba(0, 229, 255, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "primary.main",
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Divider sx={{ borderColor: "rgba(0, 229, 255, 0.06)" }} />

      {/* CTA Banner */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 8, md: 12 },
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 50%, rgba(0, 229, 255, 0.05) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <Container
          maxWidth="sm"
          sx={{ position: "relative", textAlign: "center" }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "rgba(0, 229, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              color: "primary.main",
            }}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.6rem", md: "2rem" },
            }}
          >
            Ready to go password-breach-proof?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", mb: 4, lineHeight: 1.7 }}
          >
            Scroll up and generate your first password right now. No account
            required — ever.
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(0, 229, 255, 0.08)",
                borderColor: "primary.light",
              },
            }}
          >
            Try it now — it's free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          borderTop: "1px solid rgba(0, 229, 255, 0.06)",
          textAlign: "center",
        }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          ZeroKey &mdash; Zero Trust Password Manager &bull; All computation is
          client-side. Nothing is ever sent to a server.
        </Typography>
      </Box>
    </Box>
  );
}
