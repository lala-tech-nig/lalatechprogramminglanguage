// Native Windows CLI Executable Wrapper for Lala Programming Language
// Compiles into bin\lala.exe using csc.exe

using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;

namespace LalaTech
{
    class Program
    {
        static int Main(string[] args)
        {
            string exeDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            string scriptPath = Path.Combine(exeDir, "lala.js");

            if (!File.Exists(scriptPath))
            {
                // Check parent directories or installation directory
                string fallback = Path.Combine(exeDir, "..", "bin", "lala.js");
                if (File.Exists(fallback))
                {
                    scriptPath = Path.GetFullPath(fallback);
                }
                else
                {
                    string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                    string installedScript = Path.Combine(localAppData, "Lala", "bin", "lala.js");
                    if (File.Exists(installedScript))
                    {
                        scriptPath = installedScript;
                    }
                }
            }

            // Locate node.exe
            string nodePath = "node";

            // Format arguments
            string arguments = "\"" + scriptPath + "\"";
            foreach (string arg in args)
            {
                if (arg.Contains(" ") || arg.Contains("\""))
                {
                    arguments += " \"" + arg.Replace("\"", "\\\"") + "\"";
                }
                else
                {
                    arguments += " " + arg;
                }
            }

            ProcessStartInfo psi = new ProcessStartInfo
            {
                FileName = nodePath,
                Arguments = arguments,
                UseShellExecute = false,
                RedirectStandardInput = false,
                RedirectStandardOutput = false,
                RedirectStandardError = false,
                CreateNoWindow = false
            };

            try
            {
                using (Process proc = Process.Start(psi))
                {
                    proc.WaitForExit();
                    return proc.ExitCode;
                }
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Lala Execution Error: " + ex.Message);
                Console.ResetColor();
                Console.WriteLine("Make sure Node.js is installed on your Windows PC and available in PATH.");
                return 1;
            }
        }
    }
}
