import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  MenuItem,
  Chip,
  Box,
  InputLabel,
  Select,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TimezoneSelect from "react-timezone-select";
import config from "../../../config";

const deliveryFormatOptions = [
  { value: ".pdf", label: "PDF (.pdf)" },
  { value: ".zip", label: "ZIP Archive (.zip)" },
  { value: ".mp4", label: "Video (.mp4)" },
  { value: ".fig", label: "Figma (.fig)" },
  { value: "other", label: "Other (specify below)" },
];

export default function ListingForm({
  open,
  onClose,
  onCreated,
  account,
  token,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [deliveryFormat, setDeliveryFormat] = useState("");
  const [deliveryFormatOther, setDeliveryFormatOther] = useState("");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [skillsSearch, setSkillsSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch categories and skills
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
    fetch(`${config.API_BASE_URL}/api/skills`)
      .then((res) => res.json())
      .then(setSkills)
      .catch(() => setSkills([]));
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(skillsSearch.toLowerCase())
  );

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    if (!title || !description || !budget || !categoryId) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/listings/listings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Wallet-Address": account,
          },
          body: JSON.stringify({
            client_address: account,
            title,
            description,
            category_id: categoryId,
            required_skills: requiredSkills.join(","),
            budget,
            deadline: deadline ? deadline.toISOString().slice(0, 10) : null,
            delivery_format:
              deliveryFormat === "other" ? deliveryFormatOther : deliveryFormat,
            timezone: typeof timezone === "string" ? timezone : timezone.value,
          }),
        }
      );
      if (!response.ok) {
        setError("Failed to create job listing.");
        setLoading(false);
        return;
      }
      setSuccess("Job listing created!");
      setTitle("");
      setDescription("");
      setCategoryId("");
      setRequiredSkills([]);
      setBudget("");
      setDeadline(null);
      setDeliveryFormat("");
      setDeliveryFormatOther("");
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      if (onCreated) onCreated(await response.json());
      onClose();
    } catch (err) {
      setError("Error creating job listing.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Job Listing</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            fullWidth
            required
          />
          {/* Category with search */}
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Category"
              // No custom search bar inside dropdown
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Required Skills with search */}
          <FormControl fullWidth>
            <InputLabel>Required Skills</InputLabel>
            <Select
              multiple
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              input={<OutlinedInput label="Required Skills" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const skill = skills.find(
                      (s) => s.id === value || s.name === value
                    );
                    return (
                      <Chip key={value} label={skill ? skill.name : value} />
                    );
                  })}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 300 },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <TextField
                  placeholder="Search skills..."
                  value={skillsSearch}
                  onChange={(e) => setSkillsSearch(e.target.value)}
                  size="small"
                  fullWidth
                />
              </Box>
              {filteredSkills.map((skill) => (
                <MenuItem key={skill.id} value={skill.id}>
                  {skill.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Budget (ETH)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            fullWidth
            required
          />
          {/* Deadline with DatePicker */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Deadline"
              value={deadline}
              onChange={setDeadline}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputLabelProps: { shrink: true },
                },
              }}
            />
          </LocalizationProvider>
          {/* Delivery Format */}
          <FormControl fullWidth>
            <InputLabel>Delivery Format</InputLabel>
            <Select
              value={deliveryFormat || ""}
              onChange={(e) => setDeliveryFormat(e.target.value)}
              label="Delivery Format"
            >
              {deliveryFormatOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {deliveryFormat === "other" && (
            <TextField
              label="Specify Other Format"
              value={deliveryFormatOther}
              onChange={(e) => setDeliveryFormatOther(e.target.value)}
              fullWidth
            />
          )}
          {/* Timezone */}
          <Box>
            <Box sx={{ fontWeight: 500, mb: 1 }}>Timezone</Box>
            <TimezoneSelect
              value={timezone}
              onChange={(tz) =>
                setTimezone(typeof tz === "string" ? tz : tz.value)
              }
            />
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Listing"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
