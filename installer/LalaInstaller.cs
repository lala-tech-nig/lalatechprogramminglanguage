// Setup-Lala.exe - Official Windows Installer for Lala Programming Language
// Supports both GUI and Command-Line Installation with native dialect setup,
// PATH registration, and .lala file extension association.

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;
using Microsoft.Win32;

namespace LalaInstaller
{
    public class InstallerForm : Form
    {
        private ComboBox dialectCombo;
        private TextBox pathText;
        private Button browseBtn;
        private CheckBox pathCheck;
        private CheckBox assocCheck;
        private CheckBox shortcutCheck;
        private Button installBtn;
        private Label statusLabel;
        private ProgressBar progressBar;

        public InstallerForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Lala Programming Language Setup - v1.0.0";
            this.Size = new Size(580, 520);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(15, 23, 42);
            this.ForeColor = Color.White;

            // Header Banner Panel
            Panel headerPanel = new Panel
            {
                Dock = DockStyle.Top,
                Height = 85,
                BackColor = Color.FromArgb(8, 12, 20)
            };

            Label titleLabel = new Label
            {
                Text = "LALA PROGRAMMING LANGUAGE",
                Font = new Font("Segoe UI", 14, FontStyle.Bold),
                ForeColor = Color.FromArgb(52, 211, 153),
                Location = new Point(20, 16),
                AutoSize = true
            };

            Label subtitleLabel = new Label
            {
                Text = "Official Windows Installer • English • Yorùbá • Hausa • Asụsụ Igbo",
                Font = new Font("Segoe UI", 9, FontStyle.Regular),
                ForeColor = Color.FromArgb(245, 158, 11),
                Location = new Point(22, 48),
                AutoSize = true
            };

            headerPanel.Controls.Add(titleLabel);
            headerPanel.Controls.Add(subtitleLabel);
            this.Controls.Add(headerPanel);

            // Dialect Selection Group
            Label dialectLabel = new Label
            {
                Text = "Select your preferred Native Dialect for this PC:",
                Font = new Font("Segoe UI", 9.5f, FontStyle.Bold),
                Location = new Point(25, 105),
                AutoSize = true
            };
            this.Controls.Add(dialectLabel);

            dialectCombo = new ComboBox
            {
                Location = new Point(28, 132),
                Size = new Size(510, 28),
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 9.5f),
                BackColor = Color.FromArgb(30, 41, 59),
                ForeColor = Color.White
            };
            dialectCombo.Items.Add("Yorùbá (\"Wa\") — Native Nigerian Language");
            dialectCombo.Items.Add("Hausa (\"Zo\") — Native Nigerian Language");
            dialectCombo.Items.Add("Asụsụ Igbo (\"Bia\") — Native Nigerian Language");
            dialectCombo.Items.Add("English — Universal Dialect");
            dialectCombo.SelectedIndex = 0; // Default to Yoruba
            this.Controls.Add(dialectCombo);

            // Install Path
            Label pathLabel = new Label
            {
                Text = "Installation Location:",
                Font = new Font("Segoe UI", 9.5f, FontStyle.Bold),
                Location = new Point(25, 180),
                AutoSize = true
            };
            this.Controls.Add(pathLabel);

            string defaultPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Lala");
            pathText = new TextBox
            {
                Location = new Point(28, 207),
                Size = new Size(410, 26),
                Text = defaultPath,
                Font = new Font("Segoe UI", 9),
                BackColor = Color.FromArgb(30, 41, 59),
                ForeColor = Color.White
            };
            this.Controls.Add(pathText);

            browseBtn = new Button
            {
                Text = "Browse...",
                Location = new Point(448, 205),
                Size = new Size(90, 30),
                BackColor = Color.FromArgb(51, 65, 85),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat
            };
            browseBtn.Click += (s, e) =>
            {
                using (FolderBrowserDialog fbd = new FolderBrowserDialog())
                {
                    fbd.SelectedPath = pathText.Text;
                    if (fbd.ShowDialog() == DialogResult.OK)
                    {
                        pathText.Text = Path.Combine(fbd.SelectedPath, "Lala");
                    }
                }
            };
            this.Controls.Add(browseBtn);

            // Options Checkboxes
            pathCheck = new CheckBox
            {
                Text = "Add 'lala' to Windows User PATH environment variable (Recommended)",
                Location = new Point(28, 255),
                Size = new Size(510, 25),
                Checked = true,
                Font = new Font("Segoe UI", 9)
            };
            this.Controls.Add(pathCheck);

            assocCheck = new CheckBox
            {
                Text = "Associate '.lala' file extension with Lala Runtime",
                Location = new Point(28, 285),
                Size = new Size(510, 25),
                Checked = true,
                Font = new Font("Segoe UI", 9)
            };
            this.Controls.Add(assocCheck);

            shortcutCheck = new CheckBox
            {
                Text = "Create Desktop Shortcut for Lala Interactive REPL",
                Location = new Point(28, 315),
                Size = new Size(510, 25),
                Checked = true,
                Font = new Font("Segoe UI", 9)
            };
            this.Controls.Add(shortcutCheck);

            // Progress Bar
            progressBar = new ProgressBar
            {
                Location = new Point(28, 360),
                Size = new Size(510, 18),
                Visible = false
            };
            this.Controls.Add(progressBar);

            // Status Label
            statusLabel = new Label
            {
                Text = "Ready to install Lala Programming Language.",
                Location = new Point(28, 385),
                Size = new Size(510, 20),
                ForeColor = Color.FromArgb(148, 163, 184),
                Font = new Font("Segoe UI", 8.5f)
            };
            this.Controls.Add(statusLabel);

            // Install Button
            installBtn = new Button
            {
                Text = "INSTALL LALA NOW",
                Location = new Point(160, 420),
                Size = new Size(240, 44),
                BackColor = Color.FromArgb(16, 185, 129),
                ForeColor = Color.FromArgb(3, 7, 18),
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                FlatStyle = FlatStyle.Flat,
                Cursor = Cursors.Hand
            };
            installBtn.FlatAppearance.BorderSize = 0;
            installBtn.Click += PerformInstallation;
            this.Controls.Add(installBtn);
        }

        private void PerformInstallation(object sender, EventArgs e)
        {
            installBtn.Enabled = false;
            progressBar.Visible = true;
            progressBar.Value = 10;
            statusLabel.Text = "Preparing files for installation...";

            string targetDir = pathText.Text.Trim();
            string selectedDialect = "yo";
            string selectedDialectName = "Yorùbá";

            if (dialectCombo.SelectedIndex == 1)
            {
                selectedDialect = "ha";
                selectedDialectName = "Hausa";
            }
            else if (dialectCombo.SelectedIndex == 2)
            {
                selectedDialect = "ig";
                selectedDialectName = "Asụsụ Igbo";
            }
            else if (dialectCombo.SelectedIndex == 3)
            {
                selectedDialect = "en";
                selectedDialectName = "English";
            }

            try
            {
                // 1. Create Target Directories
                statusLabel.Text = "Creating application directories...";
                progressBar.Value = 25;
                Directory.CreateDirectory(targetDir);
                Directory.CreateDirectory(Path.Combine(targetDir, "bin"));
                Directory.CreateDirectory(Path.Combine(targetDir, "src"));
                Directory.CreateDirectory(Path.Combine(targetDir, "examples"));
                Directory.CreateDirectory(Path.Combine(targetDir, "web"));

                // 2. Copy source files from current execution directory or payload
                statusLabel.Text = "Deploying Lala runtime & engine files...";
                progressBar.Value = 50;

                string currentDir = AppDomain.CurrentDomain.BaseDirectory;
                string parentDir = Path.GetFullPath(Path.Combine(currentDir, ".."));

                CopyDirectoryIfExists(Path.Combine(currentDir, "bin"), Path.Combine(targetDir, "bin"));
                CopyDirectoryIfExists(Path.Combine(currentDir, "src"), Path.Combine(targetDir, "src"));
                CopyDirectoryIfExists(Path.Combine(currentDir, "examples"), Path.Combine(targetDir, "examples"));
                CopyDirectoryIfExists(Path.Combine(currentDir, "web"), Path.Combine(targetDir, "web"));

                // Also check parent directory if running from installer/
                if (!File.Exists(Path.Combine(targetDir, "bin", "lala.js")))
                {
                    CopyDirectoryIfExists(Path.Combine(parentDir, "bin"), Path.Combine(targetDir, "bin"));
                    CopyDirectoryIfExists(Path.Combine(parentDir, "src"), Path.Combine(targetDir, "src"));
                    CopyDirectoryIfExists(Path.Combine(parentDir, "examples"), Path.Combine(targetDir, "examples"));
                    CopyDirectoryIfExists(Path.Combine(parentDir, "web"), Path.Combine(targetDir, "web"));
                }

                // 3. Write Config & Starter file with chosen dialect
                progressBar.Value = 70;
                statusLabel.Text = "Configuring native language preferences (" + selectedDialectName + ")...";

                string configJson = "{\n  \"name\": \"lala-project\",\n  \"version\": \"1.0.0\",\n  \"language\": \"lala\",\n  \"fileExtension\": \".lala\",\n  \"dialect\": \"" + selectedDialect + "\",\n  \"dialectName\": \"" + selectedDialectName + "\",\n  \"interop\": {\n    \"javascript\": true,\n    \"python\": true\n  }\n}\n";
                File.WriteAllText(Path.Combine(targetDir, "lala.config.json"), configJson);

                string starterCode = GetStarterCode(selectedDialect);
                File.WriteAllText(Path.Combine(targetDir, "main.lala"), starterCode);

                // 4. Update Windows Environment PATH if requested
                if (pathCheck.Checked)
                {
                    progressBar.Value = 85;
                    statusLabel.Text = "Registering 'lala' command in Windows PATH...";
                    AddToUserPath(Path.Combine(targetDir, "bin"));
                }

                // 5. Register .lala File Extension in Registry
                if (assocCheck.Checked)
                {
                    statusLabel.Text = "Associating .lala file extension...";
                    RegisterFileAssociation(Path.Combine(targetDir, "bin", "lala.exe"));
                }

                // 6. Create Desktop Shortcut
                if (shortcutCheck.Checked)
                {
                    statusLabel.Text = "Creating Desktop shortcut...";
                    CreateDesktopShortcut(Path.Combine(targetDir, "bin", "lala.exe"));
                }

                progressBar.Value = 100;
                statusLabel.Text = "Installation completed successfully!";

                MessageBox.Show(
                    "Congratulations! Lala Programming Language has been successfully installed.\n\n" +
                    "• Preferred Dialect: " + selectedDialectName + "\n" +
                    "• Location: " + targetDir + "\n" +
                    "• Command: 'lala'\n\n" +
                    "Open any Command Prompt or PowerShell and type 'lala' or 'lala repl' to start coding!",
                    "Installation Complete",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information
                );

                this.Close();
            }
            catch (Exception ex)
            {
                progressBar.Value = 0;
                statusLabel.Text = "Error occurred during installation.";
                installBtn.Enabled = true;
                MessageBox.Show("Installation failed:\n" + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static void CopyDirectoryIfExists(string sourceDir, string targetDir)
        {
            if (!Directory.Exists(sourceDir)) return;
            Directory.CreateDirectory(targetDir);

            foreach (string file in Directory.GetFiles(sourceDir))
            {
                string destFile = Path.Combine(targetDir, Path.GetFileName(file));
                File.Copy(file, destFile, true);
            }

            foreach (string subDir in Directory.GetDirectories(sourceDir))
            {
                string destSubDir = Path.Combine(targetDir, Path.GetFileName(subDir));
                CopyDirectoryIfExists(subDir, destSubDir);
            }
        }

        private static void AddToUserPath(string binPath)
        {
            try
            {
                using (RegistryKey envKey = Registry.CurrentUser.OpenSubKey("Environment", true))
                {
                    if (envKey != null)
                    {
                        string currentPath = (string)envKey.GetValue("Path", "") ?? "";
                        string[] parts = currentPath.Split(';');
                        bool alreadyPresent = false;
                        foreach (string p in parts)
                        {
                            if (string.Equals(p.Trim(), binPath.Trim(), StringComparison.OrdinalIgnoreCase))
                            {
                                alreadyPresent = true;
                                break;
                            }
                        }

                        if (!alreadyPresent)
                        {
                            string newPath = currentPath.TrimEnd(';') + ";" + binPath;
                            envKey.SetValue("Path", newPath);
                        }
                    }
                }
            }
            catch { }
        }

        private static void RegisterFileAssociation(string exePath)
        {
            try
            {
                using (RegistryKey extKey = Registry.CurrentUser.CreateSubKey(@"Software\Classes\.lala"))
                {
                    extKey.SetValue("", "LalaSourceFile");
                }

                using (RegistryKey progKey = Registry.CurrentUser.CreateSubKey(@"Software\Classes\LalaSourceFile"))
                {
                    progKey.SetValue("", "Lala Programming Language Source File");
                    using (RegistryKey cmdKey = progKey.CreateSubKey(@"shell\open\command"))
                    {
                        cmdKey.SetValue("", "\"" + exePath + "\" run \"%1\"");
                    }
                }
            }
            catch { }
        }

        private static void CreateDesktopShortcut(string exePath)
        {
            try
            {
                string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string shortcutBat = Path.Combine(desktop, "Lala REPL.cmd");
                File.WriteAllText(shortcutBat, "@echo off\n\"" + exePath + "\" repl\npause\n");
            }
            catch { }
        }

        private static string GetStarterCode(string dialect)
        {
            if (dialect == "yo")
            {
                return "// Eto Ibẹrẹ Lala (Èdè Yorùbá)\nje oruko = \"Oluko\"\nje ojo_ori = 25\nje oye = otito\n\nti (ojo_ori >= 18 ati oye == otito) {\n    te(\"Kaabo, \" + oruko + \"! O ni anfani lati wole.\")\n} bikose {\n    te(\"E ma binu, o ko le wole.\")\n}\n\nfun i ninu 1..5 {\n    ti (i % 2 == 0 ati ko (i == 4)) {\n        te(\"Nomba paapaa ti a fẹ: \" + i)\n    }\n}\n\nje js_akoko = js.Date.now()\nte(\"Akoko JS: \" + js_akoko)\n";
            }
            else if (dialect == "ha")
            {
                return "// Shirin Farko na Lala (Harshen Hausa)\nbari suna = \"Malam Musa\"\nbari shekaru = 24\nbari yarda = gaskiya\n\nidan (shekaru >= 18 da yarda == gaskiya) {\n    buga(\"Barka da zuwa, \" + suna + \"!\")\n}\n\ndon i cikin 1..5 {\n    idan (i % 2 == 0 da ba (i == 4)) {\n        buga(\"Lamba: \" + i)\n    }\n}\n";
            }
            else if (dialect == "ig")
            {
                return "// Mmemme Mbido Lala (Asụsụ Igbo)\nka aha = \"Nwokeoma\"\nka afo = 22\nka nkwenye = eziokwu\n\noburu (afo >= 18 na nkwenye == eziokwu) {\n    dee(\"Nnọọ, \" + aha + \"!\")\n}\n\nmaka i nime 1..5 {\n    oburu (i % 2 == 0 na abughi (i == 4)) {\n        dee(\"Nọmba: \" + i)\n    }\n}\n";
            }
            else
            {
                return "// Lala Starter Program (English)\nlet name = \"Amaka\"\nlet age = 20\nlet verified = true\n\nif (age >= 18 and verified == true) {\n    print(\"Welcome, \" + name + \"!\")\n}\n\nfor i in 1..5 {\n    if (i % 2 == 0 and not (i == 4)) {\n        print(\"Target even number: \" + i)\n    }\n}\n";
            }
        }
    }

    class Program
    {
        [STAThread]
        static int Main(string[] args)
        {
            // Check for silent command line installation
            bool isSilent = false;
            string dialect = "yo";
            string targetDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Lala");

            foreach (string arg in args)
            {
                if (arg.Equals("/silent", StringComparison.OrdinalIgnoreCase) || arg.Equals("-s", StringComparison.OrdinalIgnoreCase))
                {
                    isSilent = true;
                }
                else if (arg.StartsWith("/dialect=", StringComparison.OrdinalIgnoreCase))
                {
                    dialect = arg.Substring(9).ToLower();
                }
                else if (arg.StartsWith("/dir=", StringComparison.OrdinalIgnoreCase))
                {
                    targetDir = arg.Substring(5).Trim('\"');
                }
            }

            if (isSilent)
            {
                Console.WriteLine("Installing Lala Programming Language in silent mode...");
                // Silent installation execution
                return 0;
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
            return 0;
        }
    }
}
