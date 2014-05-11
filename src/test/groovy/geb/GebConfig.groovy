import geb.report.ScreenshotReporter

import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.ie.InternetExplorerDriver
import org.apache.commons.lang3.SystemUtils

reportsDir = "gebreport"

private String chromeDriverPath() {
	String path
	if (SystemUtils.IS_OS_MAC || SystemUtils.IS_OS_MAC_OSX) {
		path = "webdriver/chromedriver" // Mac環境の場合
	} else {
		path = "webdriver/chromedriver.exe" // Windows環境の場合
	}
	return path
}

driver = {
	System.setProperty('webdriver.chrome.driver', chromeDriverPath())
	new ChromeDriver()
}

environments {
	// when system property 'geb.env' is set to 'ie' use a remote IE driver
	// -Dgeb.env=ie
	'ie' {
		driver = {
			System.setProperty('webdriver.ie.driver', 'webdriver/IEDriverServer.exe')
			new InternetExplorerDriver()
		}
	}
	'firefox'{
		driver = {
			System.setProperty("webdriver.firefox.bin","D:\\Program Files\\Mozilla Firefox\\firefox.exe")
			new FirefoxDriver()
		}
	}
}

reporter = new ScreenshotReporter() {
	@Override
	protected escapeFileName(String name) {
		// name.replaceAll("[^\\w\\s-]", "_")
		name.replaceAll('[\\\\/:\\*?\\"&lt;>\\|]', '_')
	}
}